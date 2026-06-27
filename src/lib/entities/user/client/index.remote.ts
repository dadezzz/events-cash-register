import { requireAdmin } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { paginationSchema } from "#routes/admin/users/_schemas.ts";
import { query } from "$app/server";
import { userIdSchema } from "../id.ts";

export const getAllAdmin = query(paginationSchema, async (options) => {
  const admin = await requireAdmin();
  const batch = await admin.getAllUsers(options);
  const clients = await batch.getClients();
  return batch.ids.map((id) => clients.get(id)).filter((c) => c !== null);
});

export const countAllAdmin = query(async () => {
  const admin = await requireAdmin();
  return await admin.countAllUsers();
});

export const getUserAdmin = query.batch(userIdSchema, async (ids) => {
  const admin = await requireAdmin();
  const batch = await admin.getUsers(ids);
  const rows = await batch.getClients();

  return (id) => rows.get(id) ?? e.error404();
});

export const getPrivilegesAdmin = query.batch(userIdSchema, async (ids) => {
  const admin = await requireAdmin();
  const batch = await admin.getUsers(ids);
  const rows = await batch.getPrivileges();

  return (id) => rows.get(id) ?? [];
});
