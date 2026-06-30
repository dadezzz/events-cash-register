import * as v from "valibot";
import { productIdSchema } from "#lib/entities/products/id.ts";
import { productOptionIdSchema } from "#lib/entities/products/option/id.ts";
import { productOptionDBDataSchema } from "#lib/entities/products/option/index.ts";
import { priceSchema } from "#lib/price.ts";

export const addProductFormSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  price: priceSchema,
  available: v.optional(v.boolean(), false),

  options: v.optional(
    v.array(
      v.object({
        name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
        data: productOptionDBDataSchema,
      }),
    ),
  ),
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

export const addProductOptionFormSchema = v.object({
  productId: productIdSchema,
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
  data: productOptionDBDataSchema,
});

export const deleteProductOptionFormSchema = v.object({
  productId: productIdSchema,
  id: productOptionIdSchema,
});
