import { randomUUID } from "node:crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { CartId } from "#lib/entities/cart/id.ts";
import type { UserId } from "#lib/entities/user/id.ts";
import user from "./user.ts";

export default sqliteTable("cart", {
  id: text()
    .$type<CartId>()
    .primaryKey()
    .$default(() => randomUUID() as CartId),

  userId: text()
    .$type<UserId>()
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});
