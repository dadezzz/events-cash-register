import { inArray } from "drizzle-orm";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { availablePrinters } from "./available.ts";
import { Printer as PrinterClient } from "./client/index.ts";
import { sqlDataColumns } from "./data.ts";
import type { PrinterId } from "./id.ts";

export class PrinterBatch extends Batch<PrinterId> {
  async getClients(): Promise<BatchRows<PrinterId, PrinterClient>> {
    const rows = await db.select(sqlDataColumns).from(s.printer).where(inArray(s.printer.id, this.ids));

    return new BatchRows(
      rows.map((r) => [r.id, new PrinterClient({ ...r, available: availablePrinters.some((p) => p.db.id === r.id) })]),
    );
  }
}
