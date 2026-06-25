import type { UUID } from "node:crypto";

export type ProductId = UUID & { __brand: "ProductId" };
