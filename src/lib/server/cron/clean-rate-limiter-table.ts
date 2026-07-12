import { randomInt } from "node:crypto";
import { Cron } from "croner";
import { lte } from "drizzle-orm";
import { Duration } from "#lib/duration.ts";
import { db, s } from "#lib/server/database/index.ts";
import { logError } from "#lib/server/logger/error.ts";
import { Logger } from "#lib/server/logger/index.ts";

const logger = new Logger();
logger.setData("job", "clean-rate-limiter-table");

const job = new Cron(`${randomInt(59)} */5 * * * *`, async () => {
  try {
    const cutOffDate = new Date(Date.now() - Duration.fromDays(2).asMilliseconds());
    const result = await db.delete(s.rateLimiterToken).where(lte(s.rateLimiterToken.createdAt, cutOffDate));
    logger.info(`deleted ${result.rowsAffected} rows`);
  } catch (e) {
    if (e instanceof Error) {
      logError(e, logger);
    } else {
      console.error(e);
    }
  }
});

export function initCleanRateLimiterTableJob() {
  logger.info(`next run is scheduled at ${job.nextRun()?.toISOString()}`);
}
