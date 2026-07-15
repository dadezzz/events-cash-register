import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { CartId } from "#lib/entities/cart/id.ts";
import { timestamp } from "./_utils.ts";
import cart from "./cart.ts";

export default sqliteTable("order", {
  cartId: text()
    .$type<CartId>()
    .primaryKey()
    .references(() => cart.id, { onDelete: "restrict", onUpdate: "cascade" }),

  counter: integer().notNull(),
  discount: real().notNull(),

  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
});
