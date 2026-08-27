import { requireAdmin } from "#lib/auth/index.server.ts";
import { ProductCategory } from "#lib/entities/products/category/index.ts";
import { e } from "#lib/error.ts";
import { redirect } from "#lib/redirect.ts";
import { logger } from "#lib/server/logger/request.ts";
import { form } from "$app/server";
import { addCategorySchema, deleteCategorySchema } from "./_schemas.ts";

export const addCategoryForm = form(addCategorySchema, async (data) => {
  await requireAdmin();

  const category = await ProductCategory.create(data.name);

  logger.info({ message: "created new category", categoryId: category.id });
  redirect(`/admin/products/${category.id}`);
});

export const deleteCategoryForm = form(deleteCategorySchema, async (data) => {
  await requireAdmin();

  const category = await ProductCategory.fromId(data.id);
  if (!category) {
    throw e.error404();
  }

  await category.delete();

  logger.info({ message: "deleted category", categoryId: category.id });
  redirect(`/admin/products`);
});
