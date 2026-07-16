import { requireUser } from "#lib/auth/index.server.ts";
import { Cart } from "#lib/entities/cart/index.ts";
import { Product } from "#lib/entities/products/index.ts";
import { e } from "#lib/error.ts";
import { form } from "$app/server";
import { addProductToOrderSchema } from "./_schemas.ts";

export const addProductToOrderForm = form(addProductToOrderSchema, async (data) => {
  const user = await requireUser();

  const cart = await Cart.getUserLatestOrCreate(user);

  const product = await Product.fromId(data.productId);
  if (!product) {
    throw e.error404();
  }

  await cart.addItem(product, data.options ?? []);
});
