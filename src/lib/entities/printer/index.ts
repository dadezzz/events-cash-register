import type { JobCreationAttributesAvailable, JobCreationAttributesSelected } from "@workspace/cups/utils";
import { eq } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import { cups } from "#lib/server/cups.ts";
import { db, s } from "#lib/server/database/index.ts";
import { logger } from "#lib/server/logger/request.ts";
import { availablePrinters } from "./available.ts";
import { PrinterBatch } from "./batch.ts";
import type { PrinterId } from "./id.ts";
import { PrinterReceiptTemplate } from "./receipt-template/index.ts";

export class Printer {
  readonly id: PrinterId;

  constructor(id: PrinterId) {
    this.id = id;
  }

  static async create(name: string) {
    const printer = await db.insert(s.printer).values({ name }).returning({ id: s.printer.id }).then(getFirstOrThrow);
    return new Printer(printer.id);
  }

  static async fromId(id: PrinterId): Promise<Printer | null> {
    const printer = await db
      .select({ id: s.printer.id })
      .from(s.printer)
      .where(eq(s.printer.id, id))
      .then(getFirstOptional);
    return printer ? new Printer(printer.id) : null;
  }

  static async getAll(): Promise<PrinterBatch> {
    const printers = await db.select({ id: s.printer.id }).from(s.printer);
    return new PrinterBatch(printers.map((p) => p.id));
  }

  static async updateAvailable(): Promise<void> {
    availablePrinters.clear();
    const memorizedPrinters = await db.select({ id: s.printer.id, name: s.printer.name }).from(s.printer);
    const cupsPrinters = await cups.getPdfPrinters();

    for (const cupsPrinter of cupsPrinters) {
      const printerId = memorizedPrinters.find((mp) => mp.name === cupsPrinter.name)?.id;

      let printer: Printer;
      if (printerId) {
        printer = new Printer(printerId);
      } else {
        printer = await Printer.create(cupsPrinter.name);
      }

      const settings = await cupsPrinter.getJobCreationAttributes();
      await printer.updateAvailableSettings(settings);
      availablePrinters.set(printer.id, cupsPrinter);
    }
  }

  async updateAvailableSettings(settings: JobCreationAttributesAvailable): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(s.printerSettingAvailable).where(eq(s.printerSettingAvailable.printerId, this.id));
      await tx.insert(s.printerSettingAvailable).values(settings.map((se) => ({ printerId: this.id, ...se })));
    });
  }

  async updateSelectedSettings(settings: JobCreationAttributesSelected): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(s.printerSettingSelected).where(eq(s.printerSettingSelected.printerId, this.id));
      await tx.insert(s.printerSettingSelected).values(settings.map((se) => ({ printerId: this.id, ...se })));
    });
  }

  async getSelectedSettings(): Promise<JobCreationAttributesSelected> {
    return (await db
      .select({ name: s.printerSettingSelected.name, value: s.printerSettingSelected.value })
      .from(s.printerSettingSelected)
      .where(eq(s.printerSettingSelected.printerId, this.id))) as JobCreationAttributesSelected;
  }

  async print(title: string, pdf: Uint8Array): Promise<void> {
    const cupsPrinter = availablePrinters.get(this.id);
    if (!cupsPrinter) {
      logger.warn({ message: "print job failed because printer is unavailable", printerId: this.id });
      return;
    }

    const settings = await this.getSelectedSettings();
    await cupsPrinter.sendJob(title, settings, "application/pdf", pdf);
  }

  async getInvoiceTemplates(): Promise<PrinterReceiptTemplate[]> {
    const rows = await db
      .select({ id: s.printerReceiptTemplate.id })
      .from(s.printerReceiptTemplate)
      .where(eq(s.printerReceiptTemplate.printerId, this.id));
    return rows.map((r) => new PrinterReceiptTemplate(r.id));
  }

  async forget(): Promise<void> {
    await db.delete(s.printer).where(eq(s.printer.id, this.id));
  }
}
