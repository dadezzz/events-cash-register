import { requireAdmin } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { PrinterReceiptTemplateBatch } from "../batch.ts";
import { printerReceiptTemplateIdSchema } from "../id.ts";
import { PrinterReceiptTemplate } from "../index.ts";

export const getAll = query(async () => {
  await requireAdmin();

  const batch = await PrinterReceiptTemplate.getAll();
  const clients = await batch.getClients();

  return clients.values().toArray();
});

export const fromId = query.batch(printerReceiptTemplateIdSchema, async (ids) => {
  await requireAdmin();
  const batch = new PrinterReceiptTemplateBatch(ids);
  const clients = await batch.getClients();

  return (id) => clients.get(id) ?? e.error404();
});
