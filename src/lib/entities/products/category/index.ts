import { and, eq, isNull } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import { db, s } from "#lib/server/database/index.ts";
import type { ProductCategoryId } from "./id.ts";

export class ProductCategory {
  readonly id: ProductCategoryId;

  constructor(id: ProductCategoryId) {
    this.id = id;
  }

  static async fromId(id: ProductCategoryId): Promise<ProductCategory | null> {
    const category = await db
      .select({ id: s.productCategory.id })
      .from(s.productCategory)
      .where(eq(s.productCategory.id, id))
      .then(getFirstOptional);
    return category ? new ProductCategory(category.id) : null;
  }

  static async create(name: string): Promise<ProductCategory> {
    const category = await db
      .insert(s.productCategory)
      .values({ name })
      .returning({ id: s.productCategory.id })
      .then(getFirstOrThrow);
    return new ProductCategory(category.id);
  }

  async delete(): Promise<void> {
    await db.transaction(async (tx) => {
      const productsInCategory = await tx.$count(
        s.product,
        and(eq(s.product.categoryId, this.id), isNull(s.product.deletedAt)),
      );
      if (productsInCategory > 0) {
        throw new Error("category contains non-deleted products");
      }

      await tx.delete(s.productCategory).where(eq(s.productCategory.id, this.id));
    });
  }
}
