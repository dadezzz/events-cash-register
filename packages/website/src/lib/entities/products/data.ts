import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  id: s.product.id,
  name: s.product.name,
  price: s.product.price,
  available: s.product.available,
  createdAt: s.product.createdAt,
  categoryId: s.product.categoryId,
};

export type ProductData = InferColumnsDataTypes<typeof sqlDataColumns>;
