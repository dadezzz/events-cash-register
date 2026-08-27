import { requireUser } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import type { ProductClient } from "../../client/index.ts";
import { ProductCategoryBatch } from "../batch.ts";
import { type ProductCategoryId, productCategoryIdSchema } from "../id.ts";

export const fromId = query.batch(productCategoryIdSchema, async (ids) => {
  await requireUser();

  const batch = new ProductCategoryBatch(ids);
  const clients = await batch.getClients();

  return (id) => clients.get(id) ?? e.error404();
});

export const getAll = query(async () => {
  await requireUser();

  const batch = await ProductCategoryBatch.getAll();
  const clients = await batch.getClients();
  return clients.values().toArray();
});

export const countProducts = query.batch(productCategoryIdSchema, async (ids) => {
  await requireUser();

  const batch = new ProductCategoryBatch(ids);
  const rows = await batch.getProducts();

  const rows2 = new Map<ProductCategoryId, number>();
  for (const r of rows.entries()) {
    rows2.set(r[0], r[1].ids.length);
  }

  return (id) => rows2.get(id) ?? 0;
});

export const getProducts = query.batch(productCategoryIdSchema, async (ids) => {
  await requireUser();

  const batch = new ProductCategoryBatch(ids);
  const rows = await batch.getProducts();

  const rows2 = new Map<ProductCategoryId, ProductClient[]>();
  for (const r of rows.entries()) {
    rows2.set(r[0], (await r[1].getClients()).values().toArray());
  }

  return (id) => rows2.get(id) ?? [];
});
