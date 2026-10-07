import { requireAdmin } from "#lib/auth/index.server.ts";
import { Printer } from "#lib/entities/printer/index.ts";
import { PrinterReceiptTemplate } from "#lib/entities/printer/receipt-template/index.ts";
import { e } from "#lib/error.ts";
import { redirect } from "#lib/redirect.ts";
import { form } from "$app/server";
import { addReceiptFormSchema } from "./_schemas.ts";

export const addReceiptForm = form(addReceiptFormSchema, async (data) => {
  await requireAdmin();

  const printer = await Printer.fromId(data.printerId);
  if (!printer) {
    throw e.error404();
  }

  const receipt = await PrinterReceiptTemplate.create(data.name, printer);

  redirect(`/admin/receipts/${receipt.id}`);
});
