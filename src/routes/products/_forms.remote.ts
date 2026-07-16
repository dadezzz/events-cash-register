import { requireUser } from "#lib/auth/index.server.ts";
import { Cart } from "#lib/entities/cart/index.ts";
import { Order } from "#lib/entities/cart/order/index.ts";
import { e } from "#lib/error.ts";
import { form } from "$app/server";
import { createOrderSchema } from "./_schemas.ts";

export const createOrderForm = form(createOrderSchema, async (data) => {
  const user = await requireUser();

  const cart = await Cart.getUserLatestOrCreate(user);

  const total = await cart.getTotal();
  if (!total || total <= 0) {
    throw e.error400();
  }

  await Order.create(cart, data.price - total);
});
