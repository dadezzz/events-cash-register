import type { JobCreationAttributesSelected } from "@workspace/cups/utils";
import { inArray } from "drizzle-orm";
import type { TemplateDelegate } from "handlebars";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { Printer } from "../index.ts";
import { PrinterReceiptTemplateClient } from "./client/index.ts";
import { sqlDataColumns } from "./data.ts";
import type { PrinterReceiptTemplateId } from "./id.ts";
import { renderReceiptTemplate } from "./render.ts";

type PrintingInfo = {
  name: string;
  printer: Printer;
  template: TemplateDelegate;
  settings: JobCreationAttributesSelected;
};

export class PrinterReceiptTemplateBatch extends Batch<PrinterReceiptTemplateId> {
  static async getAll(): Promise<PrinterReceiptTemplateBatch> {
    const rows = await db.select({ id: s.receiptTemplate.id }).from(s.receiptTemplate);
    return new PrinterReceiptTemplateBatch(rows.map((r) => r.id));
  }

  async getClients(): Promise<BatchRows<PrinterReceiptTemplateId, PrinterReceiptTemplateClient>> {
    const rows = await db.select(sqlDataColumns).from(s.receiptTemplate).where(inArray(s.receiptTemplate.id, this.ids));
    return new BatchRows(rows.map((r) => [r.id, new PrinterReceiptTemplateClient(r)]));
  }

  async getPrinterSettingsSelected(): Promise<BatchRows<PrinterReceiptTemplateId, JobCreationAttributesSelected>> {
    const rows = await db
      .select({
        id: s.printerSettingSelected.receiptTemplateId,
        name: s.printerSettingSelected.name,
        value: s.printerSettingSelected.value,
      })
      .from(s.printerSettingSelected)
      .where(inArray(s.printerSettingSelected.receiptTemplateId, this.ids));

    const rows2 = new Map<PrinterReceiptTemplateId, JobCreationAttributesSelected>();
    for (const r of rows) {
      const r2 = rows2.getOrInsert(r.id, []);
      r2.push({ name: r.name, value: r.value });
    }

    return new BatchRows(rows2);
  }

  async getPrintingInfo(): Promise<BatchRows<PrinterReceiptTemplateId, PrintingInfo>> {
    const rows = await db.select().from(s.receiptTemplate).where(inArray(s.receiptTemplate.id, this.ids));
    const settings = await this.getPrinterSettingsSelected();

    const rows2 = new Map<PrinterReceiptTemplateId, PrintingInfo>();
    for (const r of rows) {
      rows2.set(r.id, {
        name: r.name,
        printer: new Printer(r.printerId),
        template: renderReceiptTemplate(r.blocks),
        settings: settings.get(r.id) ?? [],
      });
    }

    return new BatchRows(rows2);
  }
}
