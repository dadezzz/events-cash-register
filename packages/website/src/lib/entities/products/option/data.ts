import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  createdAt: s.productOption.createdAt,
  data: s.productOption.data,
  id: s.productOption.id,
  name: s.productOption.name,
  productId: s.productOption.productId,
};

export type ProductOptionData = InferColumnsDataTypes<typeof sqlDataColumns>;
