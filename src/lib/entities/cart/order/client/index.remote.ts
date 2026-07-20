import { requireUser } from "#lib/auth/index.server.ts";
import { query } from "$app/server";
import { OrderBatch } from "../batch.ts";
import { Order } from "../index.ts";
import { orderPaginationSchema } from "../pagination.ts";

export const fromPagination = query(orderPaginationSchema, async (options) => {
  await requireUser();

  const batch = await OrderBatch.fromPagination(options);
  const clients = await batch.getClients();

  // Need to preserve the order of ids.
  return batch.ids.map((id) => clients.get(id)).filter((c) => c !== null);
});

export const countAll = query(async () => {
  await requireUser();

  return await Order.countAll();
});
