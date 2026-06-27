import { randomUUID } from "node:crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { UserId } from "#lib/entities/user/id.ts";
import { timestamp } from "./utils.ts";

export default sqliteTable("user", {
  id: text()
    .$type<UserId>()
    .primaryKey()
    .$default(() => randomUUID() as UserId),
  name: text().notNull(),
  username: text().unique().notNull(),
  // If password is null, then user has been deleted.
  passwordHash: text(),
  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
});
