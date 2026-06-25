import { createClient } from "@libsql/client/node";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql/node";
import { Logger } from "#lib/server/logger/index.ts";
import { DATABASE_LOG_QUERIES, DATABASE_MIGRATIONS_FOLDER, DATABASE_URL } from "$app/env/private";
import * as s from "./tables/index.ts";

const logger = new Logger();

const db = drizzle({
  client: createClient({ url: DATABASE_URL }),
  schema: s,
  logger: {
    logQuery: (query, _params) => {
      if (DATABASE_LOG_QUERIES) {
        logger.debug({ query });
      }
    },
  },
});

await db.run(sql`PRAGMA journal_mode = WAL;`);
await db.run(sql`PRAGMA foreign_keys = true;`);
await db.run(sql`PRAGMA optimize;`);

export { db, s };

export async function initMigrateDatabase() {
  const logger = new Logger();
    logger.info("applying database migrations...");
    await migrate(db, { migrationsFolder: DATABASE_MIGRATIONS_FOLDER });
}
