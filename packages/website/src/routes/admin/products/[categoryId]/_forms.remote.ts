import { requireAdmin } from "#lib/auth/index.server.ts";
import { Product } from "#lib/entities/products/index.ts";
import { e } from "#lib/error.ts";
import { redirect } from "#lib/redirect.ts";
import { logger } from "#lib/server/logger/request.ts";
import { form } from "$app/server";
import { addProductFormSchema, deleteProductFormSchema, updateProductFormSchema } from "./_schemas.ts";

export const addProductForm = form(addProductFormSchema, async (data) => {
  await requireAdmin();

  const product = await Product.create(data);

  logger.info({ message: "created new product", productId: product.id });
  redirect(`/admin/products/${data.categoryId}/${product.id}`);
});

export const deleteProductForm = form(deleteProductFormSchema, async (data) => {
  await requireAdmin();

  const product = await Product.fromId(data.id);
  if (!product) {
    throw e.error404();
  }

  const category = await product.getCategory();
  await product.delete();

  logger.info({ message: "deleted product", productId: product.id });
  redirect(`/admin/products/${category.id}`);
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
