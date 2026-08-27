import * as v from "valibot";
import { productCategoryIdSchema } from "#lib/entities/products/category/id.ts";

export const addCategorySchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
});

export const deleteCategorySchema = v.object({
  id: productCategoryIdSchema,
});
