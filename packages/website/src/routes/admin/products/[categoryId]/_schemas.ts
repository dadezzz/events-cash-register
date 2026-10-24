import * as v from "valibot";
import { productCategoryIdSchema } from "#lib/entities/products/category/id.ts";
import { productIdSchema } from "#lib/entities/products/id.ts";
import { pricePositiveSchema } from "#lib/price.ts";

export const addProductFormSchema = v.object({
  available: v.optional(v.boolean(), false),
  categoryId: productCategoryIdSchema,
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  price: pricePositiveSchema,
});

export const deleteProductFormSchema = v.object({
  id: productIdSchema,
});

export const updateProductFormSchema = v.object({
  available: v.optional(v.boolean(), false),
  categoryId: productCategoryIdSchema,
  id: productIdSchema,
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  price: pricePositiveSchema,
});
