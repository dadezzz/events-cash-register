import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import type { PaginationOptions } from "#lib/pagination.ts";
import { db, s } from "#lib/server/database/index.ts";
import { ADMIN_PRODUCTS_PAGE_SIZE } from "$app/env/public";
import { ProductBatch } from "./batch.ts";
import type { ProductData } from "./data.ts";
import type { ProductId } from "./id.ts";
import { ProductOptionBatch } from "./option/batch.ts";
import type { ProductOptionId } from "./option/id.ts";
import type { ProductOptionDataColumn } from "./option/index.ts";
import type { PaginationSortColumn } from "./pagination.ts";

export class Product {
  id: ProductId;

  private constructor(id: ProductId) {
    this.id = id;
  }

  static async fromId(id: ProductId): Promise<Product | null> {
    const product = await db
      .select({ id: s.product.id })
      .from(s.product)
      .where(eq(s.product.id, id))
      .then(getFirstOptional);
    return product ? new Product(product.id) : null;
  }

  static async create(data: Omit<ProductData, "createdAt" | "id" | "deletedAt">): Promise<Product> {
    const product = await db.insert(s.product).values(data).returning({ id: s.product.id }).then(getFirstOrThrow);
    return new Product(product.id);
  }

  static async countAll(): Promise<number> {
    return await db.$count(s.product, isNull(s.product.deletedAt));
  }

  static async getAll(options: PaginationOptions<PaginationSortColumn>): Promise<ProductBatch> {
    const products = await db
      .select({ id: s.product.id })
      .from(s.product)
      .where(isNull(s.product.deletedAt))
      .orderBy(
        options.sortDirection === "desc" ? desc(s.product[options.sortColumn]) : asc(s.product[options.sortColumn]),
      )
      .limit(ADMIN_PRODUCTS_PAGE_SIZE)
      .offset((options.page - 1) * ADMIN_PRODUCTS_PAGE_SIZE);

    return new ProductBatch(products.map((p) => p.id));
  }

  async update(data: Omit<ProductData, "createdAt" | "id" | "deletedAt">): Promise<void> {
    await db.update(s.product).set(data).where(eq(s.product.id, this.id));
  }

  async delete(): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.update(s.productOption).set({ deletedAt: new Date() }).where(eq(s.productOption.productId, this.id));
      await tx.update(s.product).set({ deletedAt: new Date() }).where(eq(s.product.id, this.id));
    });
  }

  async addOption(name: string, data: ProductOptionDataColumn): Promise<void> {
    await db.insert(s.productOption).values({ productId: this.id, name, data });
  }

  async getOptions(): Promise<ProductOptionBatch> {
    const options = await db
      .select({ id: s.productOption.id })
      .from(s.productOption)
      .where(and(eq(s.productOption.productId, this.id), isNull(s.productOption.deletedAt)));

    return new ProductOptionBatch(options.map((o) => o.id));
  }

  async deleteOption(id: ProductOptionId): Promise<void> {
    await db
      .update(s.productOption)
      .set({ deletedAt: new Date() })
      .where(and(eq(s.productOption.productId, this.id), eq(s.productOption.id, id)));
  }
}
