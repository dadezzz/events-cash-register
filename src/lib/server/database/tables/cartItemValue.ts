import { index, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { CartItemId } from "#lib/entities/cart/cart-item/id.ts";
import type { ProductOptionId } from "#lib/entities/products/option/id.ts";
import type { ProductOptionValue } from "#lib/entities/products/option/index.ts";
import { json } from "./_utils.ts";
import cartItem from "./cartItem.ts";
import productOption from "./productOption.ts";

const columns = {
  productOptionId: text()
    .$type<ProductOptionId>()
    .notNull()
    .references(() => productOption.id, { onDelete: "restrict", onUpdate: "cascade" }),

  cartItemId: text()
    .$type<CartItemId>()
    .notNull()
    .references(() => cartItem.id, { onDelete: "cascade", onUpdate: "cascade" }),

  value: json().$type<ProductOptionValue>().notNull(),
};

export default sqliteTable("cartItemValue", columns, (t) => [
  primaryKey({ columns: [t.cartItemId, t.productOptionId] }),
  index("cartItemValue_cartItemId").on(t.cartItemId),
]);
