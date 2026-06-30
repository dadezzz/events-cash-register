import * as v from "valibot";
import { productIdSchema } from "#lib/entities/products/id.ts";
import { priceSchema } from "#lib/price.ts";

export const addProductFormSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  price: priceSchema,
  available: v.optional(v.boolean(), false),
});

export const deleteProductFormSchema = v.object({
  id: productIdSchema,
});

export const updateProductFormSchema = v.object({
  id: productIdSchema,
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  price: priceSchema,
  available: v.optional(v.boolean(), false),
});
