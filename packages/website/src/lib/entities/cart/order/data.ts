import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  cartId: s.order.cartId,
  counter: s.order.counter,
  finalPrice: s.order.finalPrice,
};

export type OrderData = InferColumnsDataTypes<typeof sqlDataColumns>;
