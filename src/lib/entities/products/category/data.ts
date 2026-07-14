import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  id: s.productCategory.id,
  name: s.productCategory.name,
};

export type ProductCategoryData = InferColumnsDataTypes<typeof sqlDataColumns>;
