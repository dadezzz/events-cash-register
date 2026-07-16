import { and, eq, exists, inArray } from "drizzle-orm";
import { Product } from "#lib/entities/products/index.ts";
import { calculateProductOptionPrice } from "#lib/entities/products/option/index.ts";
import type { User } from "#lib/entities/user/index.ts";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { CartItemClient } from "./client/index.ts";
import type { CartItemId } from "./id.ts";
import type { CartItemValue } from "./index.ts";

export class CartItemBatch extends Batch<CartItemId> {
  static async forUser(user: User, ids: CartItemId[]): Promise<CartItemBatch> {
    const rows = await db
      .select({ id: s.cartItem.id })
      .from(s.cartItem)
      .where(
        and(
          inArray(s.cartItem.id, ids),
          exists(
            db
              .select()
              .from(s.cart)
              .where(and(eq(s.cart.id, s.cartItem.cartId), eq(s.cart.userId, user.id))),
          ),
        ),
      );

    return new CartItemBatch(rows.map((r) => r.id));
  }

  async getClients(): Promise<BatchRows<CartItemId, CartItemClient>> {
    const rows = await db
      .select({ id: s.cartItem.id, productId: s.cartItem.productId })
      .from(s.cartItem)
      .where(inArray(s.cartItem.id, this.ids));

    return new BatchRows(rows.map((r) => [r.id, new CartItemClient(r)]));
  }

  async getValues(): Promise<BatchRows<CartItemId, CartItemValue[]>> {
    const rows = await db
      .select({
        cartItemId: s.cartItemValue.cartItemId,
        optionId: s.cartItemValue.productOptionId,
        optionData: s.productOption.data,
        value: s.cartItemValue.value,
      })
      .from(s.cartItemValue)
      .innerJoin(s.productOption, eq(s.productOption.id, s.cartItemValue.productOptionId))
      .where(inArray(s.cartItemValue.cartItemId, this.ids));

    const rows2 = new Map<CartItemId, CartItemValue[]>();
    for (const { cartItemId, optionData, ...cartItemValue } of rows) {
      rows2
        .getOrInsert(cartItemId, [])
        .push({ ...cartItemValue, price: calculateProductOptionPrice(optionData, cartItemValue.value) });
    }

    return new BatchRows(rows2);
  }

  async getProducts(): Promise<BatchRows<CartItemId, Product>> {
    const rows = await db
      .select({ id: s.cartItem.id, productId: s.cartItem.productId })
      .from(s.cartItem)
      .where(inArray(s.cartItem.id, this.ids));

    return new BatchRows(rows.map((r) => [r.id, new Product(r.productId)]));
  }
}
