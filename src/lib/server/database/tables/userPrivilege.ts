import { index, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { UserId, UserPrivilege } from "#lib/entities/user/id.ts";
import user from "./user.ts";

const columns = {
  privilege: text().$type<UserPrivilege>().notNull(),

  userId: text()
    .$type<UserId>()
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
};

export default sqliteTable("userPrivilege", columns, (t) => [
  primaryKey({ columns: [t.privilege, t.userId] }),
  // We usually get all privileges for a single user.
  index("userPrivilege_userId").on(t.userId),
]);
