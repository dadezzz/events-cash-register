import { createHash } from "node:crypto";
import { and, eq, exists } from "drizzle-orm";
import { getFirstOptional } from "#lib/array.ts";
import type { ProductId } from "#lib/entities/products/id.ts";
import type { ProductOptionId } from "#lib/entities/products/option/id.ts";
import type { ProductOptionValue } from "#lib/entities/products/option/index.ts";
import type { User } from "#lib/entities/user/index.ts";
import { db, s } from "#lib/server/database/index.ts";
import type { CartItemId } from "./id.ts";

export type CartItemValue = { optionId: ProductOptionId; price: number | null; value: ProductOptionValue };

export class CartItem {
  readonly id: CartItemId;

  constructor(id: CartItemId) {
    this.id = id;
  }

  static hash(productId: ProductId, values: { optionId: ProductOptionId; value: ProductOptionValue }[]) {
    const hash = createHash("sha256");
    const sortedValues = values.toSorted((a, b) => (a.optionId < b.optionId ? -1 : 1));
    hash.update(`${productId};${sortedValues.map((v) => `${v.optionId}:${v.value}`).join(";")}`);
    return hash.digest("base64");
  }

  static async forUser(user: User, id: CartItemId): Promise<CartItem | null> {
    const cartItem = await db
      .select({ id: s.cartItem.id })
      .from(s.cartItem)
      .where(
        and(
          eq(s.cartItem.id, id),
          exists(
            db
              .select()
              .from(s.cart)
              .where(and(eq(s.cart.id, s.cartItem.cartId), eq(s.cart.userId, user.id))),
          ),
        ),
      )
      .then(getFirstOptional);

    return cartItem ? new CartItem(cartItem.id) : null;
  }

  async delete(): Promise<void> {
    await db.delete(s.cartItem).where(eq(s.cartItem.id, this.id));
  }
}
