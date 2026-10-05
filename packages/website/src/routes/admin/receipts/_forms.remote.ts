import { requireAdmin } from "#lib/auth/index.server.ts";
import { Printer } from "#lib/entities/printer/index.ts";
import { PrinterReceiptTemplate } from "#lib/entities/printer/receipt-template/index.ts";
import { e } from "#lib/error.ts";
import { redirect } from "#lib/redirect.ts";
import { form } from "$app/server";
import { addReceiptFormSchema, updateBlocksFormSchema, updateOptionsFormSchema } from "./_schemas.ts";

export const addReceiptForm = form(addReceiptFormSchema, async (data) => {
  await requireAdmin();

  const printer = await Printer.fromId(data.printerId);
  if (!printer) {
    throw e.error404();
  }

  const receipt = await PrinterReceiptTemplate.create(data.name, printer);

  redirect(`/admin/receipts/${receipt.id}`);
});

export const updateBlocksForm = form(updateBlocksFormSchema, async (data) => {
  await requireAdmin();

  const receipt = await PrinterReceiptTemplate.fromId(data.id);
  if (!receipt) {
    throw e.error404();
  }

  await receipt.updateBlocks(data.blocks);
});

export const updateOptionsForm = form(updateOptionsFormSchema, async (data) => {
  await requireAdmin();

  const receipt = await PrinterReceiptTemplate.fromId(data.id);
  if (!receipt) {
    throw e.error404();
  }

  const printer = await Printer.fromId(data.printerId);
  if (!printer) {
    throw e.error404();
  }

  await receipt.update(data.name, printer);
});
