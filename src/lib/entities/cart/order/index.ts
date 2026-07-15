import { eq } from "drizzle-orm";
import { getFirstOrThrow } from "#lib/array.ts";
import { db, s } from "#lib/server/database/index.ts";
import type { CartId } from "../id.ts";
import type { Cart } from "../index.ts";

const COUNTER_DB_KEY = "currentOrderCount";

export class Order {
  cartId: CartId;

  constructor(cartId: CartId) {
    this.cartId = cartId;
  }

  static async create(cart: Cart, discount: number): Promise<Order> {
    await db.transaction(async (tx) => {
      const counterRow = await tx
        .select({ value: s.ordersState.value })
        .from(s.ordersState)
        .where(eq(s.ordersState.key, COUNTER_DB_KEY))
        .then(getFirstOrThrow);

      const counterValue = (counterRow.value as number) + 1;

      await tx.update(s.ordersState).set({ value: counterValue }).where(eq(s.ordersState.key, COUNTER_DB_KEY));
      await tx.insert(s.order).values({ cartId: cart.id, counter: counterValue, discount });
    });

    // Here we should also print receipts.

    return new Order(cart.id);
  }

  static async resetCounter(): Promise<void> {
    await db.update(s.ordersState).set({ value: 0 }).where(eq(s.ordersState.key, COUNTER_DB_KEY));
  }
}

export async function initOrderState() {
  await db.insert(s.ordersState).values({ key: COUNTER_DB_KEY, value: 0 }).onConflictDoNothing();
}
