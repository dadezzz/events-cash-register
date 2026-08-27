import type { UUID } from "node:crypto";
import * as v from "valibot";

export type PrinterId = UUID & { __brand: "PrinterId" };

export const printerIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as PrinterId),
);
