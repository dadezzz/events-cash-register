import { inArray, isNull } from "drizzle-orm";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { ProductBatch } from "../batch.ts";
import type { ProductId } from "../id.ts";
import { ProductCategoryClient } from "./client/index.ts";
import { sqlDataColumns } from "./data.ts";
import type { ProductCategoryId } from "./id.ts";

export class ProductCategoryBatch extends Batch<ProductCategoryId> {
  static async getAll(): Promise<ProductCategoryBatch> {
    const rows = await db
      .select({ id: s.productCategory.id })
      .from(s.productCategory)
      .where(isNull(s.productCategory.deletedAt));
    return new ProductCategoryBatch(rows.map((r) => r.id));
  }

  async getClients(): Promise<BatchRows<ProductCategoryId, ProductCategoryClient>> {
    const rows = await db.select(sqlDataColumns).from(s.productCategory).where(inArray(s.productCategory.id, this.ids));
    return new BatchRows(rows.map((r) => [r.id, new ProductCategoryClient(r)]));
  }

  async getProducts(): Promise<BatchRows<ProductCategoryId, ProductBatch>> {
    const rows = await db
      .select({ id: s.product.id, categoryId: s.product.categoryId })
      .from(s.product)
      .where(inArray(s.product.categoryId, this.ids));

    const rows2 = new Map<ProductCategoryId, ProductId[]>();
    for (const r of rows) {
      rows2.getOrInsert(r.categoryId, []).push(r.id);
    }

    const rows3 = new Map<ProductCategoryId, ProductBatch>();
    for (const r of rows2.entries()) {
      rows3.set(r[0], new ProductBatch(r[1]));
    }

    return new BatchRows(rows3);
  }
}
