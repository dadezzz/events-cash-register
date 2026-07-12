import type { JobCreationAttributesAvailable, JobCreationAttributesSelected } from "@workspace/cups/utils";
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
    return new BatchRows(rows.map((r) => [r.id, new PrinterClient({ ...r, available: availablePrinters.has(r.id) })]));
  }

  async getSettingsAvailable(): Promise<BatchRows<PrinterId, JobCreationAttributesAvailable>> {
    const rows = await db
      .select({
        printerId: s.printerSettingAvailable.printerId,
        name: s.printerSettingAvailable.name,
        type: s.printerSettingAvailable.type,
        constraints: s.printerSettingAvailable.constraints,
        default: s.printerSettingAvailable.default,
      })
      .from(s.printerSettingAvailable)
      .where(inArray(s.printerSettingAvailable.printerId, this.ids));

    const rows2: Record<PrinterId, JobCreationAttributesAvailable> = {};
    for (const r of rows) {
      rows2[r.printerId] ??= [];
      rows2[r.printerId].push(r as JobCreationAttributesAvailable[number]);
    }

    return new BatchRows(rows2);
  }

  async getSettingsSelected(): Promise<BatchRows<PrinterId, JobCreationAttributesSelected>> {
    const rows = await db
      .select({
        printerId: s.printerSettingSelected.printerId,
        name: s.printerSettingSelected.name,
        value: s.printerSettingSelected.value,
      })
      .from(s.printerSettingSelected)
      .where(inArray(s.printerSettingSelected.printerId, this.ids));

    const rows2: Record<PrinterId, JobCreationAttributesSelected> = {};
    for (const r of rows) {
      rows2[r.printerId] ??= [];
      rows2[r.printerId].push(r as JobCreationAttributesSelected[number]);
    }

    return new BatchRows(rows2);
  }
}
