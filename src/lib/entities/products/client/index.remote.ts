import { requireUser } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { ProductBatch } from "../batch.ts";
import { productIdSchema } from "../id.ts";

export const fromId = query.batch(productIdSchema, async (ids) => {
  await requireUser();

  const batch = new ProductBatch(ids);
  const clients = await batch.getClients();

  return (id) => clients.get(id) ?? e.error404();
});

export const getOptions = query.batch(productIdSchema, async (ids) => {
  await requireUser();

  const batch = new ProductBatch(ids);
  const optionsBatch = await batch.getOptions();
  const clients = await optionsBatch.getClients();

  return (id) =>
    clients
      .values()
      .filter((c) => c.data.productId === id)
      .toArray();
});
