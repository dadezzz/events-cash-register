import { requireUser } from "#lib/auth/index.server.ts";
import { ProductBatch } from "#lib/entities/products/batch.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { CartItemBatch } from "../batch.ts";
import { cartItemIdSchema } from "../id.ts";

export const getProduct = query.batch(cartItemIdSchema, async (ids) => {
  const user = await requireUser();

  const batch = await CartItemBatch.forUser(user, ids);
  const products = await batch.getProducts();
  const productsBatch = new ProductBatch(
    products
      .values()
      .map((p) => p.id)
      .toArray(),
  );
  const productClients = await productsBatch.getClients();

  return (id) => {
    const productId = products.get(id)?.id;
    if (!productId) {
      throw e.error404();
    }

    const productClient = productClients.get(productId);
    if (!productClient) {
      throw e.error404();
    }

    return productClient;
  };
});
