import type { JobCreationAttributesSelected } from "@workspace/cups/utils";
import { requireAdmin } from "#lib/auth/index.server.ts";
import { Printer } from "#lib/entities/printer/index.ts";
import { e } from "#lib/error.ts";
import { redirect } from "#lib/redirect.ts";
import { form } from "$app/server";
import { deletePrinterFormSchema, updateSettingsFormSchema } from "./_schemas.ts";

export const updateSettingsForm = form(updateSettingsFormSchema, async (data) => {
  await requireAdmin();

  const printer = await Printer.fromId(data.printerId);
  if (!printer) {
    throw e.error404();
  }

  await printer.updateSelectedSettings(
    data.settings.map(({ name, sValue }) => ({ name, value: sValue })) as JobCreationAttributesSelected,
  );
});

export const deletePrinterForm = form(deletePrinterFormSchema, async (data) => {
  await requireAdmin();

  const printer = await Printer.fromId(data.id);
  if (!printer) {
    throw e.error404();
  }

  const invoiceTemplates = await printer.getInvoiceTemplates();
  if (invoiceTemplates.length > 0) {
    // TODO: show a more user friendly error.
    throw e.error400();
  }

  await printer.forget();

  redirect("/admin/printers");
});
