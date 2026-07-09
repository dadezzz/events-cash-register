import { eq } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import { cups } from "#lib/server/cups.ts";
import { db, s } from "#lib/server/database/index.ts";
import { Logger } from "#lib/server/logger/index.ts";
import { availablePrinters } from "./available.ts";
import { PrinterBatch } from "./batch.ts";
import { type PrinterSettingData, sqlSettingDataColumns } from "./data.ts";
import type { PrinterId } from "./id.ts";

export interface PrinterSettingDataColumn {
  valueTag: number;
  value: unknown;
}

export class Printer {
  readonly id: PrinterId;

  constructor(id: PrinterId) {
    this.id = id;
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

  static async create(name: string): Promise<Printer> {
    const printer = await db.insert(s.printer).values({ name }).returning({ id: s.printer.id }).then(getFirstOrThrow);
    return new Printer(printer.id);
  }

  static async updateAvailable(): Promise<void> {
    const memorizedPrinters = await db.select({ id: s.printer.id, name: s.printer.name }).from(s.printer);
    const cupsPrinters = await cups.getPrinters();

    for (const p of cupsPrinters) {
      let printer = memorizedPrinters.find((mp) => mp.name === p.name);

      if (!printer) {
        const newPrinter = await Printer.create(p.name);
        printer = { id: newPrinter.id, name: p.name };
      }

      availablePrinters.push({ cups: p, db: new Printer(printer.id) });
    }
  }

  async updateSettings(settings: { name: string; data: PrinterSettingDataColumn }[]): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(s.printerSetting).where(eq(s.printerSetting.printerId, this.id));
      await tx.insert(s.printerSetting).values(settings.map((s) => ({ printerId: this.id, ...s })));
    });
  }

  async getSettings(): Promise<PrinterSettingData[]> {
    return await db.select(sqlSettingDataColumns).from(s.printerSetting).where(eq(s.printerSetting.printerId, this.id));
  }

  async print(document: File) {
    const cupsPrinter = availablePrinters.find((p) => p.db.id === this.id)?.cups;

    if (!cupsPrinter) {
      throw new Error("printer is not available anymore");
    }

    const settings = await this.getSettings();

    // TODO
    // cupsPrinter.sendJob(settings, file)
  }
}

export async function initPrinters(): Promise<void> {
  await Printer.updateAvailable();

  const logger = new Logger();
  logger.info(`found ${availablePrinters.length} available printers`);
}
