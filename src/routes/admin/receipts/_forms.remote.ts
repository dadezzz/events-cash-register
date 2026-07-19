import { requireAdmin } from "#lib/auth/index.server.ts";
import { Printer } from "#lib/entities/printer/index.ts";
import { PrinterReceiptTemplate } from "#lib/entities/printer/receipt-template/index.ts";
import { e } from "#lib/error.ts";
import { form } from "$app/server";
import { createReceiptSchema } from "./_schemas.ts";

export const createReceiptForm = form(createReceiptSchema, async (data) => {
  await requireAdmin();

  const printer = await Printer.fromId(data.printerId);
  if (!printer) {
    throw e.error404();
  }

  await PrinterReceiptTemplate.create(data.name, printer, data.blocks);
});
