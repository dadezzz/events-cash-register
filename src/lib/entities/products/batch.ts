import { and, inArray, isNull } from "drizzle-orm";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { Product as ProductClient } from "./client/index.ts";
import { sqlDataColumns } from "./data.ts";
import type { ProductId } from "./id.ts";
import { ProductOption as ProductOptionClient } from "./option/client.ts";
import { sqlDataColumns as sqlOptionDataColumns } from "./option/data.ts";

export class ProductBatch extends Batch<ProductId> {
  static async fromIds(ids: ProductId[]): Promise<ProductBatch> {
    const products = await db.select({ id: s.product.id }).from(s.product).where(inArray(s.product.id, ids));
    return new ProductBatch(products.map((p) => p.id));
  }

  async getClients(): Promise<BatchRows<ProductId, ProductClient>> {
    const rows = await db.select(sqlDataColumns).from(s.product).where(inArray(s.product.id, this.ids));
    return new BatchRows(rows.map((r) => [r.id, new ProductClient(r)]));
  }

  async getOptions(): Promise<BatchRows<ProductId, ProductOptionClient[]>> {
    const rows = await db
      .select({ productId: s.productOption.productId, ...sqlOptionDataColumns })
      .from(s.productOption)
      .where(and(inArray(s.productOption.productId, this.ids), isNull(s.productOption.deletedAt)));

    const rows2: Record<ProductId, ProductOptionClient[]> = {};
    for (const r of rows) {
      rows2[r.productId] ??= [];
      rows2[r.productId].push(new ProductOptionClient(r));
    }

    return new BatchRows(rows2);
  }
}
