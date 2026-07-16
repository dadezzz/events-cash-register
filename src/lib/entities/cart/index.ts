import { and, eq, notExists } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import type { Product } from "#lib/entities/products/index.ts";
import type { ProductOptionId } from "#lib/entities/products/option/id.ts";
import type { ProductOptionValue } from "#lib/entities/products/option/index.ts";
import type { User } from "#lib/entities/user/index.ts";
import { db, s } from "#lib/server/database/index.ts";
import { ProductBatch } from "../products/batch.ts";
import { CartItemBatch } from "./cart-item/batch.ts";
import type { CartItemId } from "./cart-item/id.ts";
import type { CartId } from "./id.ts";

export class Cart {
  readonly id: CartId;

  constructor(id: CartId) {
    this.id = id;
  }

  static async getUserLatestOrCreate(user: User): Promise<Cart> {
    const cart = await db.transaction(async (tx) => {
      const cart = await tx
        .select({ id: s.cart.id })
        .from(s.cart)
        .where(
          and(eq(s.cart.userId, user.id), notExists(tx.select().from(s.order).where(eq(s.order.cartId, s.cart.id)))),
        )
        .then(getFirstOptional);

      if (cart) {
        return cart;
      }

      return await tx.insert(s.cart).values({ userId: user.id }).returning({ id: s.cart.id }).then(getFirstOrThrow);
    });

    return new Cart(cart.id);
  }

  async countItems(): Promise<number> {
    return await db.$count(s.cartItem, eq(s.cartItem.cartId, this.id));
  }

  async addItem(
    product: Product,
    values: { productOptionId: ProductOptionId; value: ProductOptionValue }[],
  ): Promise<void> {
    await db.transaction(async (tx) => {
      const cartItem = await tx
        .insert(s.cartItem)
        .values({ cartId: this.id, productId: product.id })
        .returning({ id: s.cartItem.id })
        .then(getFirstOrThrow);

      if (values.length > 0) {
        await tx.insert(s.cartItemValue).values(values.map((v) => ({ cartItemId: cartItem.id, ...v })));
      }
    });
  }

  async deleteItem(cartItemId: CartItemId): Promise<void> {
    await db.transaction(async (tx) => {
      const order = await tx
        .select({ id: s.order.cartId })
        .from(s.order)
        .where(eq(s.order.cartId, this.id))
        .then(getFirstOptional);

      if (order) {
        throw new Error("can't delete items for already created orders");
      }

      tx.delete(s.cartItem).where(and(eq(s.cartItem.cartId, this.id), eq(s.cartItem.id, cartItemId)));
    });
  }

  async getItems(): Promise<CartItemBatch> {
    const items = await db.select({ id: s.cartItem.id }).from(s.cartItem).where(eq(s.cartItem.cartId, this.id));
    return new CartItemBatch(items.map((i) => i.id));
  }

  async getTotal(): Promise<number | null> {
    const cartItemsBatch = await this.getItems();
    const cartItemValues = await cartItemsBatch.getValues();
    const cartItemProducts = await cartItemsBatch.getProducts();
    const productsBatch = new ProductBatch(
      cartItemProducts
        .values()
        .map((p) => p.id)
        .toArray(),
    );
    const productPrices = await productsBatch.getPrices();

    let total = 0;
    for (const cartItemId of cartItemsBatch.ids) {
      const values = cartItemValues.get(cartItemId);
      const productId = cartItemProducts.get(cartItemId)?.id;
      const productPrice = productId ? productPrices.get(productId) : null;

      if (!values || values.some((v) => v.price === null) || productPrice === null) {
        return null;
      }

      // Invalid values are filtered above.
      total += productPrice + values.map((v) => v.price as number).reduce((a, b) => a + b, 0);
    }

    return total;
  }
}
