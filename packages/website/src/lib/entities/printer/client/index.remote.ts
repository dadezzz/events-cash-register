import { requireAdmin } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { PrinterBatch } from "../batch.ts";
import { printerIdSchema } from "../id.ts";
import { Printer } from "../index.ts";

export const getAll = query(async () => {
  await requireAdmin();

  const batch = await Printer.getAll();
  const clients = await batch.getClients();

  return clients.values().toArray();
});

export const fromId = query.batch(printerIdSchema, async (ids) => {
  await requireAdmin();
  const batch = new PrinterBatch(ids);
  const clients = await batch.getClients();

  return (id) => clients.get(id) ?? e.error404();
});

export const getSettingsAvailable = query.batch(printerIdSchema, async (ids) => {
  await requireAdmin();
  const batch = new PrinterBatch(ids);
  const settings = await batch.getSettingsAvailable();

  return (id) => settings.get(id) ?? [];
});

export const getSettingsSelected = query.batch(printerIdSchema, async (ids) => {
  await requireAdmin();
  const batch = new PrinterBatch(ids);
  const settings = await batch.getSettingsSelected();

  return (id) => settings.get(id) ?? [];
});

export const getReceiptTemplates = query.batch(printerIdSchema, async (ids) => {
  await requireAdmin();

  const printersBatch = new PrinterBatch(ids);
  const receiptTemplatesBatch = await printersBatch.getReceiptTemplates();
  const clients = await receiptTemplatesBatch.getClients();

  return (id) =>
    clients
      .values()
      .filter((c) => c.data.printerId === id)
      .toArray();
});
