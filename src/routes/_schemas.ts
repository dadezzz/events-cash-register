import * as v from "valibot";
import { ProductClient } from "#lib/entities/products/client/index.ts";
import { productIdSchema } from "#lib/entities/products/id.ts";
import { priceSchema } from "#lib/price.ts";

export const addProductToOrderSchema = v.lazyAsync(async (input) => {
  const { productId } = v.parse(v.object({ productId: productIdSchema }), input);

  const product = await ProductClient.fromId(productId);
  const options = await product.getOptions();

  return v.object({
    productId: productIdSchema,
    // Optional since a product can be without options.
    options: v.optional(
      v.array(
        v.variant(
          "productOptionId",
          options.map((o) =>
            v.object({
              productOptionId: v.literal(o.data.id),
              value: o.getSchema(),
            }),
          ),
        ),
      ),
    ),
  });
});

export const createOrderSchema = v.object({
  discount: priceSchema,
});
