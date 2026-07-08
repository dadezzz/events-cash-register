import { requireUser } from "#lib/auth/index.server.ts";
import { query } from "$app/server";
import { ProductBatch } from "../batch.ts";
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

export const getOptions = query.batch(productIdSchema, async (ids) => {
  await requireUser();
  const batch = await ProductBatch.fromIds(ids);
  const options = await batch.getOptions();

  return (id) => options.get(id) ?? [];
});
