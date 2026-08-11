import { inArray } from "drizzle-orm";
import type { TemplateDelegate } from "handlebars";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { Printer } from "../index.ts";
import { PrinterReceiptTemplateClient } from "./client.ts";
import { sqlDataColumns } from "./data.ts";
import type { PrinterReceiptTemplateId } from "./id.ts";
import { renderReceiptTemplate } from "./render.ts";

type PrintingInfo = { name: string; printer: Printer; template: TemplateDelegate };

export class PrinterReceiptTemplateBatch extends Batch<PrinterReceiptTemplateId> {
  static async getAll(): Promise<PrinterReceiptTemplateBatch> {
    const rows = await db.select({ id: s.printerReceiptTemplate.id }).from(s.printerReceiptTemplate);
    return new PrinterReceiptTemplateBatch(rows.map((r) => r.id));
  }

  async getClients(): Promise<BatchRows<PrinterReceiptTemplateId, PrinterReceiptTemplateClient>> {
    const rows = await db
      .select(sqlDataColumns)
      .from(s.printerReceiptTemplate)
      .where(inArray(s.printerReceiptTemplate.id, this.ids));
    return new BatchRows(rows.map((r) => [r.id, new PrinterReceiptTemplateClient(r)]));
  }

  async getPrintingInfo(): Promise<BatchRows<PrinterReceiptTemplateId, PrintingInfo>> {
    const rows = await db.select().from(s.printerReceiptTemplate).where(inArray(s.printerReceiptTemplate.id, this.ids));

    const rows2 = new Map<PrinterReceiptTemplateId, PrintingInfo>();
    for (const r of rows) {
      rows2.set(r.id, {
        name: r.name,
        printer: new Printer(r.printerId),
        template: renderReceiptTemplate(r.blocks),
      });
    }

    return new BatchRows(rows2);
  }
}
