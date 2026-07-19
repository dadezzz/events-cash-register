import { getFirstOrThrow } from "#lib/array.ts";
import { db, s } from "#lib/server/database/index.ts";
import type { Printer } from "../index.ts";
import type { PrinterReceiptTemplateId } from "./id.ts";
import type { RootBlockData } from "./schema.ts";

export class PrinterReceiptTemplate {
  readonly id: PrinterReceiptTemplateId;

  constructor(id: PrinterReceiptTemplateId) {
    this.id = id;
  }

  static async create(name: string, printer: Printer, blocks: RootBlockData): Promise<PrinterReceiptTemplate> {
    const row = await db
      .insert(s.printerReceiptTemplate)
      .values({ name, printerId: printer.id, blocks })
      .returning({ id: s.printerReceiptTemplate.id })
      .then(getFirstOrThrow);

    return new PrinterReceiptTemplate(row.id);
  }
}
