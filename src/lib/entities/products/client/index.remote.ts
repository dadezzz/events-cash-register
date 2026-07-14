import { requireUser } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { ProductBatch } from "../batch.ts";
import { productIdSchema } from "../id.ts";
import { ProductOptionClient as ProductOptionClient } from "../option/client.ts";

export const fromId = query.batch(productIdSchema, async (ids) => {
  await requireUser();

  const batch = new ProductBatch(ids);
  const clients = await batch.getClients();

  return (id) => clients.get(id) ?? e.error404();
});

export const getOptions = query.batch(productIdSchema, async (ids) => {
  await requireUser();

  const batch = new ProductBatch(ids);
  const options = await batch.getOptions();

  return (id) => options.get(id)?.map((d) => new ProductOptionClient(d)) ?? [];
});
