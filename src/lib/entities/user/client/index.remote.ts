import { requireAdmin } from "#lib/auth/index.server.ts";
import { pageNumberSchema } from "#lib/pagination.ts";
import { query } from "$app/server";

export const getAllAdmin = query(pageNumberSchema, async (page) => {
  const admin = await requireAdmin();
  const batch = await admin.getAllUsers(page);
  const clients = await batch.getClients();
  return clients.values().toArray();
});

export const countAllAdmin = query(async () => {
  const admin = await requireAdmin();
  return await admin.countAllUsers();
});
