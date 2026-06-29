import { inArray } from "drizzle-orm";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { Product as ProductClient } from "./client/index.ts";
import { sqlDataColumns } from "./data.ts";
import type { ProductId } from "./id.ts";

export class ProductBatch extends Batch<ProductId> {
  async getClients(): Promise<BatchRows<ProductId, ProductClient>> {
    const rows = await db.select(sqlDataColumns).from(s.product).where(inArray(s.product.id, this.ids));
    return new BatchRows(rows.map((r) => [r.id, new ProductClient(r)]));
  }
}
