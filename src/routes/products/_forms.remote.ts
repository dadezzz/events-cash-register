import { requireUser } from "#lib/auth/index.server.ts";
import { CartItem } from "#lib/entities/cart/cart-item/index.ts";
import { Cart } from "#lib/entities/cart/index.ts";
import { Order } from "#lib/entities/cart/order/index.ts";
import { e } from "#lib/error.ts";
import { form } from "$app/server";
import { createOrderFormSchema, deleteCartItemFormSchema } from "./_schemas.ts";

export const deleteCartItemForm = form(deleteCartItemFormSchema, async (data) => {
  const user = await requireUser();

  const cartItem = await CartItem.forUser(user, data.id);
  if (!cartItem) {
    throw e.error404();
  }

  await cartItem.delete();
});

export const createOrderForm = form(createOrderFormSchema, async (data) => {
  const user = await requireUser();

  const cart = await Cart.getUserLatestOrCreate(user);
  const order = await Order.create(cart, data.finalPrice);

  if (!order) {
    throw e.error400();
  }
});
