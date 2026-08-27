import { createHash } from "node:crypto";
import { and, asc, eq, gte } from "drizzle-orm";
import type { Duration } from "#lib/duration.ts";
import { db, s } from "#lib/server/database/index.ts";
import { Logger } from "#lib/server/logger/index.ts";
import { logger } from "#lib/server/logger/request.ts";

/**
 * A SHA-256 hash of a client identifier, used to store tokens in the database
 * without exposing raw client IDs.
 */
export class ClientHash {
  /** The base64-encoded SHA-256 digest. */
  readonly digest: string;

  /**
   * Creates a new client hash from the given client ID.
   * @param clientId The raw client identifier to hash.
   */
  constructor(clientId: string) {
    const hash = createHash("sha256");
    hash.update(clientId);
    this.digest = hash.digest("base64");
  }
}

/**
 * A rate limiting rule defining how many tokens can be consumed within a time window.
 */
export type TimeWindow = {
  /** Number of tokens that can be consumed in the time window. */
  tokens: number;
  /** Duration of the time window. */
  duration: Duration;
};

/** Token bucket rate limiter. */
export class RateLimiter {
  private readonly bucketGroup: string;
  private readonly rates: TimeWindow[];

  /**
   * @param bucketGroup Name of the rate limiter, used to prevent conflicts between the various rate limiters.
   * @param rates Maximum rates for token usage. The limiter fails when one is exceeded.
   */
  constructor(bucketGroup: string, rates: TimeWindow[]) {
    this.bucketGroup = bucketGroup;

    // Sort rates by ascending time duration.
    this.rates = rates.toSorted((a, b) => {
      return a.duration.asMilliseconds() - b.duration.asMilliseconds();
    });

    let maxTimeWindowDuration = 0;
    for (const r of this.rates) {
      if (r.duration.asMilliseconds() <= maxTimeWindowDuration) {
        // One time window would render the other useless.
        throw new Error("two time windows cannot have the same duration");
      }
      maxTimeWindowDuration = r.duration.asMilliseconds();
    }

    let maxTimeWindowTokens = 0;
    for (const r of this.rates) {
      if (r.tokens <= maxTimeWindowTokens) {
        throw new Error("smaller time windows with more tokens that the larger ones don't do anything");
      }
      maxTimeWindowTokens = r.tokens;
    }

    const logger = new Logger();
    logger.info({ message: "initialized rate-limiter", bucketGroup: this.bucketGroup });
  }

  /**
   * @returns The duration of the longest time window. Tokens older than this are
   * not considered.
   */
  getMaxTimeWindowDuration(): Duration {
    return this.rates[this.rates.length - 1].duration;
  }

  /**
   * Returns the earliest date when the client can make their next request.
   * If the client is not rate limited, returns the current date.
   * @param clientId The client identifier or a pre-computed `ClientHash`.
   */
  async getNextTokenDate(clientId: string | ClientHash): Promise<Date> {
    const clientHash = typeof clientId === "string" ? new ClientHash(clientId) : clientId;
    const now = Date.now();

    // Get all tokens that aren't expired for this client from the database.
    const tokens = await db
      .select({ createdAt: s.rateLimiterToken.createdAt })
      .from(s.rateLimiterToken)
      .where(
        and(
          eq(s.rateLimiterToken.bucket, clientHash.digest),
          eq(s.rateLimiterToken.bucketGroup, this.bucketGroup),
          gte(s.rateLimiterToken.createdAt, new Date(now - this.getMaxTimeWindowDuration().asMilliseconds())),
        ),
      )
      .orderBy(asc(s.rateLimiterToken.createdAt));

    for (const r of this.rates) {
      // Keep only tokens that are considered by this time window.
      const tokensInWindow = tokens.filter((t) => t.createdAt >= new Date(now - r.duration.asMilliseconds()));

      // Check that the number of tokens doesn't exceed that of the time window.
      if (tokensInWindow.length > r.tokens) {
        // First token is the oldest, so it will be the first to expire.
        return new Date(tokensInWindow[0].createdAt.getTime() + r.duration.asMilliseconds());
      }
    }

    return new Date(now);
  }

  /**
   * Consumes a token for the given client. Returns the date when the client
   * can make their next request if rate limited, or `null` if the token was
   * consumed successfully.
   * @param clientId The client identifier.
   */
  async consumeToken(clientId: string): Promise<Date | null> {
    const clientHash = new ClientHash(clientId);
    const nextDate = await this.getNextTokenDate(clientHash);

    if (nextDate <= new Date()) {
      await db.insert(s.rateLimiterToken).values({ bucket: clientHash.digest, bucketGroup: this.bucketGroup });
      return null;
    }

    logger.warn({
      message: "hit rate limiter",
      clientId,
      clientHash: clientHash.digest,
      bucket: this.bucketGroup,
    });

    return nextDate;
  }
}
