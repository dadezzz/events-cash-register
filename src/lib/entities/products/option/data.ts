import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  id: s.productOption.id,
  name: s.productOption.name,
  data: s.productOption.data,
  createdAt: s.productOption.createdAt,
};

export type ProductOptionData = InferColumnsDataTypes<typeof sqlDataColumns>;
