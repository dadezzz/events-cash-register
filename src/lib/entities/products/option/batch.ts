import { inArray } from "drizzle-orm";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { ProductOptionClient } from "./client.ts";
import { sqlDataColumns } from "./data.ts";
import type { ProductOptionId } from "./id.ts";

export class ProductOptionBatch extends Batch<ProductOptionId> {
  async getClients(): Promise<BatchRows<ProductOptionId, ProductOptionClient>> {
    const rows = await db.select(sqlDataColumns).from(s.productOption).where(inArray(s.productOption.id, this.ids));
    return new BatchRows(rows.map((r) => [r.id, new ProductOptionClient(r)]));
  }
}
