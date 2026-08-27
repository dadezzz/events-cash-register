import type { UUID } from "node:crypto";
import * as v from "valibot";

export type CartId = UUID & { __brand: "CartId" };

export const cartIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as CartId),
);
