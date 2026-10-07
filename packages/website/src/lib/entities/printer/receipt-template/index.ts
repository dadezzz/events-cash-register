import type { JobCreationAttributesSelected } from "@workspace/cups/utils";
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
      .insert(s.receiptTemplate)
      .values({ name, printerId: printer.id, blocks: { type: "root", blocks: [] } })
      .returning({ id: s.receiptTemplate.id })
      .then(getFirstOrThrow);

    return new PrinterReceiptTemplate(row.id);
  }

  static async getAll(): Promise<PrinterReceiptTemplateBatch> {
    const receipts = await db.select({ id: s.receiptTemplate.id }).from(s.receiptTemplate);
    return new PrinterReceiptTemplateBatch(receipts.map((p) => p.id));
  }

  static async fromId(id: PrinterReceiptTemplateId): Promise<PrinterReceiptTemplate | null> {
    const row = await db
      .select({ id: s.receiptTemplate.id })
      .from(s.receiptTemplate)
      .where(eq(s.receiptTemplate.id, id))
      .then(getFirstOptional);

    return row ? new PrinterReceiptTemplate(row.id) : null;
  }

  async update(name: string, printer: Printer): Promise<void> {
    await db.update(s.receiptTemplate).set({ name, printerId: printer.id }).where(eq(s.receiptTemplate.id, this.id));
  }

  async updateBlocks(blocks: RootBlockData): Promise<void> {
    await db.update(s.receiptTemplate).set({ blocks }).where(eq(s.receiptTemplate.id, this.id));
  }

  async updatePrinter(printer: Printer, settings: JobCreationAttributesSelected): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.update(s.receiptTemplate).set({ printerId: printer.id }).where(eq(s.receiptTemplate.id, this.id));
      await tx.delete(s.printerSettingSelected).where(eq(s.printerSettingSelected.receiptTemplateId, this.id));
      await tx.insert(s.printerSettingSelected).values(settings.map((se) => ({ receiptTemplateId: this.id, ...se })));
    });
  }

  async delete(): Promise<void> {
    await db.delete(s.receiptTemplate).where(eq(s.receiptTemplate.id, this.id));
  }
}
