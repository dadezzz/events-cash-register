import type { UUID } from "node:crypto";
import * as v from "valibot";

export type ProductOptionId = UUID & { __brand: "ProductOptionId" };

export const productOptionIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as ProductOptionId),
);
