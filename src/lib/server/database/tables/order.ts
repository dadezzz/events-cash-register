import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { CartId } from "#lib/entities/cart/id.ts";
import { timestamp } from "./_utils.ts";
import cart from "./cart.ts";

export default sqliteTable("order", {
  cartId: text()
    .$type<CartId>()
    .primaryKey()
    .references(() => cart.id, { onDelete: "cascade", onUpdate: "cascade" }),

  counter: integer().notNull(),
  // User can arbitrarily modify the price of the order. So we store what they
  // selected here.
  finalPrice: real().notNull(),

  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
});
