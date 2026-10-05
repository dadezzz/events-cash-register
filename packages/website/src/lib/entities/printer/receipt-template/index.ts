import { eq } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import { db, s } from "#lib/server/database/index.ts";
import type { Printer } from "../index.ts";
import { PrinterReceiptTemplateBatch } from "./batch.ts";
import type { PrinterReceiptTemplateId } from "./id.ts";
import type { RootBlockData } from "./schema.ts";

export class PrinterReceiptTemplate {
  readonly id: PrinterReceiptTemplateId;

  constructor(id: PrinterReceiptTemplateId) {
    this.id = id;
  }

  static async create(name: string, printer: Printer): Promise<PrinterReceiptTemplate> {
    const row = await db
      .insert(s.printerReceiptTemplate)
      .values({ name, printerId: printer.id, blocks: { type: "root", blocks: [] } })
      .returning({ id: s.printerReceiptTemplate.id })
      .then(getFirstOrThrow);

    return new PrinterReceiptTemplate(row.id);
  }

  static async getAll(): Promise<PrinterReceiptTemplateBatch> {
    const receipts = await db.select({ id: s.printerReceiptTemplate.id }).from(s.printerReceiptTemplate);
    return new PrinterReceiptTemplateBatch(receipts.map((p) => p.id));
  }

  static async fromId(id: PrinterReceiptTemplateId): Promise<PrinterReceiptTemplate | null> {
    const row = await db
      .select({ id: s.printerReceiptTemplate.id })
      .from(s.printerReceiptTemplate)
      .where(eq(s.printerReceiptTemplate.id, id))
      .then(getFirstOptional);

    return row ? new PrinterReceiptTemplate(row.id) : null;
  }

  async update(name: string, printer: Printer): Promise<void> {
    await db
      .update(s.printerReceiptTemplate)
      .set({ name, printerId: printer.id })
      .where(eq(s.printerReceiptTemplate.id, this.id));
  }

  async updateBlocks(blocks: RootBlockData): Promise<void> {
    await db.update(s.printerReceiptTemplate).set({ blocks }).where(eq(s.printerReceiptTemplate.id, this.id));
  }
}
