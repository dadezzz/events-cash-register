import { requireUser } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { ProductOptionBatch } from "../batch.ts";
import { productOptionIdSchema } from "../id.ts";

export const fromId = query.batch(productOptionIdSchema, async (ids) => {
  await requireUser();

  const batch = new ProductOptionBatch(ids);
  const clients = await batch.getClients();

  return (id) => clients.get(id) ?? e.error404();
});
