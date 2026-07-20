import { asc, desc, inArray } from "drizzle-orm";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import type { CartId } from "../id.ts";
import { OrderClient } from "./client/index.ts";
import { sqlDataColumns } from "./data.ts";
import type { OrderPaginationOptions } from "./pagination.ts";

export class OrderBatch extends Batch<CartId> {
  static async fromPagination(options: OrderPaginationOptions): Promise<OrderBatch> {
    const rows = await db
      .select({ cartId: s.order.cartId })
      .from(s.order)
      .orderBy(options.sortDirection === "desc" ? desc(s.order[options.sortColumn]) : asc(s.order[options.sortColumn]))
      .limit(options.pageSize)
      .offset((options.page - 1) * options.pageSize);

    return new OrderBatch(rows.map((u) => u.cartId));
  }

  async getClients(): Promise<BatchRows<CartId, OrderClient>> {
    const rows = await db.select(sqlDataColumns).from(s.order).where(inArray(s.order.cartId, this.ids));
    return new BatchRows(rows.map((r) => [r.cartId, new OrderClient(r)]));
  }
}
