import { and, eq, inArray } from "drizzle-orm";
import type { User } from "#lib/entities/user/index.ts";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { CartItem } from "./cart-item/index.ts";
import { CartClient } from "./client/index.ts";
import type { CartId } from "./id.ts";

export class CartBatch extends Batch<CartId> {
  static async forUser(user: User, ids: CartId[]): Promise<CartBatch> {
    const rows = await db
      .select({ id: s.cart.id })
      .from(s.cart)
      .where(and(inArray(s.cart.id, ids), eq(s.cart.userId, user.id)));

    return new CartBatch(rows.map((r) => r.id));
  }

  getClients(): BatchRows<CartId, CartClient> {
    return new BatchRows(this.ids.map((i) => [i, new CartClient({ id: i })]));
  }

  async getItems(): Promise<BatchRows<CartId, CartItem[]>> {
    const rows = await db
      .select({ id: s.cartItem.id, cartId: s.cartItem.cartId })
      .from(s.cartItem)
      .where(inArray(s.cartItem.cartId, this.ids));

    const rows2 = new Map<CartId, CartItem[]>();
    for (const r of rows) {
      rows2.getOrInsert(r.cartId, []).push(new CartItem(r.id));
    }

    return new BatchRows(rows2);
  }
}
