import type { UUID } from "node:crypto";
import * as v from "valibot";

export type CartItemId = UUID & { __brand: "CartItemId" };

export const cartItemIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as CartItemId),
);
