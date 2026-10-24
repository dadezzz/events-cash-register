import * as v from "valibot";
import { productIdSchema } from "#lib/entities/products/id.ts";
import { productOptionIdSchema } from "#lib/entities/products/option/id.ts";
import { productOptionDataColumnSchema } from "#lib/entities/products/option/index.ts";

export const addProductOptionFormSchema = v.object(
  {
    data: productOptionDataColumnSchema,
    name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
    productId: productIdSchema,
  },
  "Selezionare un'opzione",
);

export const deleteProductOptionFormSchema = v.object({
  id: productOptionIdSchema,
  productId: productIdSchema,
});
