import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  available: s.product.available,
  categoryId: s.product.categoryId,
  createdAt: s.product.createdAt,
  id: s.product.id,
  name: s.product.name,
  price: s.product.price,
};

export type ProductData = InferColumnsDataTypes<typeof sqlDataColumns>;
