import { requireUser } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { productIdSchema } from "../id.ts";
import { Product } from "../index.ts";
import { paginationSchema } from "../pagination.ts";

export const countAll = query(async () => {
  await requireUser();
  return await Product.countAll();
});

export const getAll = query(paginationSchema, async (options) => {
  await requireUser();
  const batch = await Product.getAll(options);
  const clients = await batch.getClients();
  return batch.ids.map((id) => clients.get(id)).filter((c) => c !== null);
});

export const getOptions = query(productIdSchema, async (id) => {
  await requireUser();

  const product = await Product.fromId(id);

  if (!product) {
    throw e.error404();
  }

  const batch = await product.getOptions();
  const clients = await batch.getClients();
  return clients.values().toArray();
});
