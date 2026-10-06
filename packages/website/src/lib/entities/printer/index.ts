import type { CupsPrinter } from "@workspace/cups";
import type { JobCreationAttributesSelected } from "@workspace/cups/utils";
import { eq } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import { cups } from "#lib/server/cups.ts";
import { db, s } from "#lib/server/database/index.ts";
import { logger } from "#lib/server/logger/request.ts";
import { PrinterBatch } from "./batch.ts";
import type { PrinterId } from "./id.ts";
import { PrinterReceiptTemplate } from "./receipt-template/index.ts";

const availablePrinters = new Map<PrinterId, CupsPrinter>();

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

  static async refreshAvailable(): Promise<void> {
    type MemorizedPrinter = { id: PrinterId; name: string };
    const printers = new Map<string, { mp?: MemorizedPrinter; cp?: CupsPrinter }>();

    const cupsPrinters = await cups.getPdfPrinters();
    for (const cp of cupsPrinters) {
      printers.set(cp.name, { cp });
    }

    await db.transaction(async (tx) => {
      // Set all printers as not available by default.
      const memorizedPrinters = await tx
        .update(s.printer)
        .set({ available: false })
        .returning({ id: s.printer.id, name: s.printer.name });

      for (const mp of memorizedPrinters) {
        const p = printers.getOrInsert(mp.name, {});
        p.mp = mp;
      }

      for (const p of printers.values()) {
        if (p.cp) {
          if (p.mp) {
            // Make the printer available.
            await tx.update(s.printer).set({ available: true }).where(eq(s.printer.id, p.mp.id));
          } else {
            // Create the printer if it wasn't known.
            p.mp = await tx
              .insert(s.printer)
              .values({ name: p.cp.name, available: true })
              .returning({ id: s.printer.id, name: s.printer.name })
              .then(getFirstOrThrow);
          }

          // Synchronise available settings.
          const settings = await p.cp.getJobCreationAttributes();
          // biome-ignore lint/style/noNonNullAssertion: p.mp set above if missing.
          await tx.delete(s.printerSettingAvailable).where(eq(s.printerSettingAvailable.printerId, p.mp!.id));
          // biome-ignore lint/style/noNonNullAssertion: See above.
          await tx.insert(s.printerSettingAvailable).values(settings.map((s) => ({ printerId: p.mp!.id, ...s })));

          // biome-ignore lint/style/noNonNullAssertion: See above.
          availablePrinters.set(p.mp!.id, p.cp);
        }
      }
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

export async function initRefreshPrinters() {
  await Printer.refreshAvailable();
}
