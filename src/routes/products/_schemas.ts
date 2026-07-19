import * as v from "valibot";
import { pricePositiveSchema } from "#lib/price.ts";

export const createOrderSchema = v.object({
  finalPrice: pricePositiveSchema,
});
