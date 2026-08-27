import type { UUID } from "node:crypto";
import * as v from "valibot";

export type ProductId = UUID & { __brand: "ProductId" };

export const productIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as ProductId),
);
