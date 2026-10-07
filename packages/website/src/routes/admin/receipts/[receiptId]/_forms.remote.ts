import type { JobCreationAttributesSelected } from "@workspace/cups/utils";
import { requireAdmin } from "#lib/auth/index.server.ts";
import { Printer } from "#lib/entities/printer/index.ts";
import { PrinterReceiptTemplate } from "#lib/entities/printer/receipt-template/index.ts";
import { e } from "#lib/error.ts";
import { redirect } from "#lib/redirect.ts";
import { form } from "$app/server";
import { deleteReceiptSchema, updatePrinterFormSchema } from "./_schemas.ts";

export const deleteReceiptForm = form(deleteReceiptSchema, async (data) => {
  await requireAdmin();

  const receipt = await PrinterReceiptTemplate.fromId(data.id);
  if (!receipt) {
    throw e.error404();
  }

  await receipt.delete();

  redirect("/admin/receipts");
});

export const updatePrinterForm = form(updatePrinterFormSchema, async (data) => {
  await requireAdmin();

  const receipt = await PrinterReceiptTemplate.fromId(data.id);
  if (!receipt) {
    throw e.error404();
  }

  const printer = await Printer.fromId(data.printerId);
  if (!printer) {
    throw e.error404();
  }

  await receipt.updatePrinter(
    printer,
    data.settings.map(({ name, sValue }) => ({ name, value: sValue })) as JobCreationAttributesSelected,
  );
});
