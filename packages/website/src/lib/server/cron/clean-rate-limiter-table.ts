import { randomInt } from "node:crypto";
import { lte } from "drizzle-orm";
import { Duration } from "#lib/duration.ts";
import { db, s } from "#lib/server/database/index.ts";
import { job } from "./index.ts";

export function initCleanRateLimiterTableJob() {
  job("clean rate-limiter tokens", `${randomInt(59)} */5 * * * *`, async ({ logger }) => {
    const cutOffDate = new Date(Date.now() - Duration.fromDays(2).asMilliseconds());
    const result = await db.delete(s.rateLimiterToken).where(lte(s.rateLimiterToken.createdAt, cutOffDate));
    logger.log(result.rowsAffected > 0 ? "info" : "trace", `deleted ${result.rowsAffected} rows`);
  });
}
