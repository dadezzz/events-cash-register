import { requireAdmin } from "#lib/auth/index.server.ts";
import { query } from "$app/server";
import { Printer } from "../index.ts";

export const getAll = query(async () => {
  await requireAdmin();
  const batch = await Printer.getAll();
  const clients = await batch.getClients();
  return clients.values().toArray();
});
