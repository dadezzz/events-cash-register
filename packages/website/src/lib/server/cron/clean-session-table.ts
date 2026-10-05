import { randomInt } from "node:crypto";
import { lte } from "drizzle-orm";
import { db, s } from "#lib/server/database/index.ts";
import { SESSION_MAX_AGE } from "$app/env/private";
import { job } from "./index.ts";

export function initCleanSessionTableJob() {
  job("clean expired sessions", `${randomInt(59)} */5 * * * *`, async ({ logger }) => {
    const cutOffDate = new Date(Date.now() - SESSION_MAX_AGE.asMilliseconds());
    const result = await db.delete(s.session).where(lte(s.session.createdAt, cutOffDate));
    logger.info(`deleted ${result.rowsAffected} rows`);
  });
}
