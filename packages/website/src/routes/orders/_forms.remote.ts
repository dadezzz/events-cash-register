import { requireAdmin } from "#lib/auth/index.server.ts";
import { Order } from "#lib/entities/cart/order/index.ts";
import { e } from "#lib/error.ts";
import { form } from "$app/server";
import { deleteOrderFormSchema } from "./_schemas.ts";

export const deleteOrderForm = form(deleteOrderFormSchema, async (data) => {
  await requireAdmin();

  const order = await Order.fromId(data.cartId);
  if (!order) {
    return e.error404();
  }

  await order.delete();
});
