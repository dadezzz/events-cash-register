import { asc, desc, eq, not } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import type { PaginationOptions } from "#lib/pagination.ts";
import { db, s } from "#lib/server/database/index.ts";
import { ADMIN_PRODUCTS_PAGE_SIZE } from "$app/env/public";
import { ProductBatch } from "./batch.ts";
import type { ProductData } from "./data.ts";
import type { PaginationSortColumn } from "./pagination.ts";
import type { ProductId } from "./utils.ts";

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

  static async create(data: Omit<ProductData, "createdAt" | "id">): Promise<Product> {
    const product = await db.insert(s.product).values(data).returning({ id: s.product.id }).then(getFirstOrThrow);
    return new Product(product.id);
  }

  async update(data: Omit<ProductData, "createdAt" | "id">): Promise<void> {
    await db.update(s.product).set(data).where(eq(s.product.id, this.id));
  }

  async delete(): Promise<void> {
    await db.update(s.product).set({ deleted: true }).where(eq(s.product.id, this.id));
  }

  static async countAll(): Promise<number> {
    return await db.$count(s.product, not(s.product.deleted));
  }

  static async getAll(options: PaginationOptions<PaginationSortColumn>): Promise<ProductBatch> {
    const products = await db
      .select({ id: s.product.id })
      .from(s.product)
      .where(not(s.product.deleted))
      .orderBy(
        options.sortDirection === "desc" ? desc(s.product[options.sortColumn]) : asc(s.product[options.sortColumn]),
      )
      .limit(ADMIN_PRODUCTS_PAGE_SIZE)
      .offset((options.page - 1) * ADMIN_PRODUCTS_PAGE_SIZE);

    return new ProductBatch(products.map((p) => p.id));
  }
}
