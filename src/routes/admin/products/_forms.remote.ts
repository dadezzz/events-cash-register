import { requireAdmin } from "#lib/auth/index.server.ts";
import { Product } from "#lib/entities/products/index.ts";
import { e } from "#lib/error.ts";
import { logger } from "#lib/server/logger/request.ts";
import { form } from "$app/server";
import {
  addProductFormSchema,
  addProductOptionFormSchema,
  deleteProductFormSchema,
  deleteProductOptionFormSchema,
  updateProductFormSchema,
} from "./_schemas.ts";

export const addProductForm = form(addProductFormSchema, async (data) => {
  await requireAdmin();

  const product = await Product.create(data);

  for (const option of data.options ?? []) {
    product.addOption(option.name, option.data);
  }
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

export const addProductOptionForm = form(addProductOptionFormSchema, async (data) => {
  await requireAdmin();

  const product = await Product.fromId(data.productId);
  if (!product) {
    throw e.error404();
  }

  await product.addOption(data.name, data.data);
  logger.info({ message: "added new option to product", productId: product.id });
});

export const deleteProductOptionForm = form(deleteProductOptionFormSchema, async (data) => {
  await requireAdmin();

  const product = await Product.fromId(data.productId);
  if (!product) {
    throw e.error404();
  }

  await product.deleteOption(data.id);
  logger.info({ message: "deleted option from product", productId: product.id });
});
