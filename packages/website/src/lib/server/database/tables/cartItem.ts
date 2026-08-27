import { randomUUID } from "node:crypto";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { CartItemId } from "#lib/entities/cart/cart-item/id.ts";
import type { CartId } from "#lib/entities/cart/id.ts";
import type { ProductId } from "#lib/entities/products/id.ts";
import cart from "./cart.ts";
import product from "./product.ts";

const columns = {
  id: text()
    .$type<CartItemId>()
    .primaryKey()
    .$default(() => randomUUID() as CartItemId),

  productId: text()
    .$type<ProductId>()
    .notNull()
    .references(() => product.id, { onDelete: "restrict", onUpdate: "cascade" }),

  cartId: text()
    .$type<CartId>()
    .notNull()
    .references(() => cart.id, { onDelete: "cascade", onUpdate: "cascade" }),
};

export default sqliteTable("cartItem", columns, (t) => [index("cartItem_cartId").on(t.cartId)]);
