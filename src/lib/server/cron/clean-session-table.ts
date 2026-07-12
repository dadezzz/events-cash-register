import { randomInt } from "node:crypto";
import { Cron } from "croner";
import { lte } from "drizzle-orm";
import { db, s } from "#lib/server/database/index.ts";
import { logError } from "#lib/server/logger/error.ts";
import { Logger } from "#lib/server/logger/index.ts";
import { SESSION_MAX_AGE } from "$app/env/private";

const logger = new Logger();
logger.setData("job", "clean-session-table");

const job = new Cron(`${randomInt(59)} */5 * * * *`, async () => {
  try {
    const cutOffDate = new Date(Date.now() - SESSION_MAX_AGE.asMilliseconds());
    const result = await db.delete(s.session).where(lte(s.session.createdAt, cutOffDate));
    logger.info(`deleted ${result.rowsAffected} rows`);
  } catch (e) {
    if (e instanceof Error) {
      logError(e, logger);
    } else {
      console.error(e);
    }
  }
});

export function initCleanSessionTableJob() {
  logger.info(`next run is scheduled at ${job.nextRun()?.toISOString()}`);
}
