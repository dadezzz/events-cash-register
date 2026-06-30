import { inArray } from "drizzle-orm";
import * as v from "valibot";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { ProductOption as ProductOptionClient } from "./client.ts";
import { sqlDataColumns } from "./data.ts";
import type { ProductOptionId } from "./id.ts";
import type { ProductOptionValue } from "./index.ts";
import { productOptionBooleanValueSchema, productOptionChoiceValueSchema } from "./schema.ts";

export class ProductOptionBatch extends Batch<ProductOptionId> {
  async getPrices(
    values: BatchRows<ProductOptionId, ProductOptionValue>,
  ): Promise<BatchRows<ProductOptionId, number | null>> {
    const rows = await db
      .select({ id: s.productOption.id, data: s.productOption.data })
      .from(s.productOption)
      .where(inArray(s.productOption.id, this.ids));

    const rows2: [ProductOptionId, number | null][] = [];
    for (const r of rows) {
      switch (r.data.type) {
        case "boolean": {
          let value = null;
          try {
            value = v.parse(productOptionBooleanValueSchema, values.get(r.id));
          } catch {}

          if (value === null) {
            rows2.push([r.id, null]);
          } else {
            rows2.push([r.id, value ? r.data.price : 0]);
          }

          break;
        }
        case "choice": {
          let value = null;
          try {
            value = v.parse(productOptionChoiceValueSchema(r.data.entries.map((e) => e.value)), values.get(r.id));
          } catch {}

          if (value === null) {
            rows2.push([r.id, null]);
          } else {
            const d = r.data.entries.find((d) => d.value === value);
            rows2.push([r.id, d?.price ?? null]);
          }

          break;
        }
      }
    }

    return new BatchRows(rows2);
  }

  async getClients(): Promise<BatchRows<ProductOptionId, ProductOptionClient>> {
    const rows = await db.select(sqlDataColumns).from(s.productOption).where(inArray(s.productOption.id, this.ids));
    return new BatchRows(rows.map((r) => [r.id, new ProductOptionClient(r)]));
  }
}
