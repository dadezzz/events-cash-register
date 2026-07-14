import type { UUID } from "node:crypto";
import * as v from "valibot";

export type OrderId = UUID & { __brand: "OrderId" };

export const orderIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as OrderId),
);
