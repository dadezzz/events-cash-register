import { requireAdmin } from "#lib/auth/index.server.ts";
import { Product } from "#lib/entities/products/index.ts";
import { e } from "#lib/error.ts";
import { logger } from "#lib/server/logger/request.ts";
import { form } from "$app/server";
import { addProductFormSchema, deleteProductFormSchema, updateProductFormSchema } from "./_schemas.ts";

export const addProductForm = form(addProductFormSchema, async (data) => {
  await requireAdmin();
  await Product.create(data);
});

export const deleteProductForm = form(deleteProductFormSchema, async (data) => {
  await requireAdmin();
  const product = await Product.fromId(data.id);

  if (!product) {
    throw e.error404();
  }

  await product.delete();
  logger.info({ message: "deleted product", productId: product.id });
});

export const updateProductForm = form(updateProductFormSchema, async (data) => {
  await requireAdmin();
  const product = await Product.fromId(data.id);

  if (!product) {
    throw e.error404();
  }

  await product.update(data);
  logger.info({ message: "updated product", productId: product.id });
});
