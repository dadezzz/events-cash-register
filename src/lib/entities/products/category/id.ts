import type { UUID } from "node:crypto";
import * as v from "valibot";

export type ProductCategoryId = UUID & { __brand: "ProductCategoryId" };

export const productCategoryIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as ProductCategoryId),
);
