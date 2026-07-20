import * as v from "valibot";
import { productIdSchema } from "#lib/entities/products/id.ts";
import { productOptionIdSchema } from "#lib/entities/products/option/id.ts";
import { productOptionDataColumnSchema } from "#lib/entities/products/option/index.ts";

export const addProductOptionFormSchema = v.object(
  {
    productId: productIdSchema,
    name: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
    data: productOptionDataColumnSchema,
  },
  "Selezionare un'opzione",
);

export const deleteProductOptionFormSchema = v.object({
  productId: productIdSchema,
  id: productOptionIdSchema,
});
