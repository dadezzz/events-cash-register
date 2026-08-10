import { requireAdmin } from "#lib/auth/index.server.ts";
import { Product } from "#lib/entities/products/index.ts";
import { e } from "#lib/error.ts";
import { logger } from "#lib/server/logger/request.ts";
import { form } from "$app/server";
import { addProductOptionFormSchema, deleteProductOptionFormSchema } from "./_schemas.ts";

export const addOptionForm = form(addProductOptionFormSchema, async (data) => {
  await requireAdmin();

  const product = await Product.fromId(data.productId);
  if (!product) {
    throw e.error404();
  }

  await product.addOption(data.name, data.data);

  logger.info({ message: "added new option to product", productId: product.id });
});

export const deleteOptionForm = form(deleteProductOptionFormSchema, async (data) => {
  await requireAdmin();

  const product = await Product.fromId(data.productId);
  if (!product) {
    throw e.error404();
  }

  await product.deleteOption(data.id);

  logger.info({ message: "deleted option from product", productId: product.id });
});
