import { requireUser } from "#lib/auth/index.server.ts";
import { Cart } from "#lib/entities/cart/index.ts";
import { Order } from "#lib/entities/cart/order/index.ts";
import { Product } from "#lib/entities/products/index.ts";
import { e } from "#lib/error.ts";
import { form } from "$app/server";
import { addProductToOrderSchema, createOrderSchema } from "./_schemas.ts";

export const addProductToOrderForm = form(addProductToOrderSchema, async (data) => {
  const user = await requireUser();

  const cart = await Cart.getUserLatestOrCreate(user);

  const product = await Product.fromId(data.productId);
  if (!product) {
    throw e.error404();
  }

  await cart.addItem(product, data.options ?? []);
});

export const createOrderForm = form(createOrderSchema, async (data) => {
  const user = await requireUser();

  const cart = await Cart.getUserLatestOrCreate(user);
  if ((await cart.countItems()) === 0) {
    e.error400();
  }

  await Order.create(cart, data.discount);
});
