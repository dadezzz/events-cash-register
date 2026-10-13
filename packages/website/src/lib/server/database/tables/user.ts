import { randomUUID } from "node:crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { UserId } from "#lib/entities/user/id.ts";
import type { PHCString } from "#lib/server/argon2.ts";
import { timestamp } from "./_utils.ts";

export default sqliteTable("user", {
  id: text()
    .$type<UserId>()
    .primaryKey()
    .$default(() => randomUUID() as UserId),

  name: text().notNull(),
  username: text().notNull().unique(),
  passwordHash: text().$type<PHCString>().notNull(),

  deletedAt: timestamp(),
  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
});
