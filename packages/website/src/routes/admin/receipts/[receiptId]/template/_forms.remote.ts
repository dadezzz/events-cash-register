import { requireAdmin } from "#lib/auth/index.server.ts";
import { PrinterReceiptTemplate } from "#lib/entities/printer/receipt-template/index.ts";
import { e } from "#lib/error.ts";
import { form } from "$app/server";
import { updateBlocksFormSchema } from "./_schemas.ts";

export const updateBlocksForm = form(updateBlocksFormSchema, async (data) => {
  await requireAdmin();

  const receipt = await PrinterReceiptTemplate.fromId(data.id);
  if (!receipt) {
    throw e.error404();
  }

  await receipt.updateBlocks(data.blocks);
});
