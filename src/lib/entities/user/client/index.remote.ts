import { requireAdmin } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { userIdSchema } from "../id.ts";
import { User } from "../index.ts";
import { paginationSchema } from "../pagination.ts";

export const getAllAdmin = query(paginationSchema, async (options) => {
  await requireAdmin();
  const batch = await User.getAll(options);
  const clients = await batch.getClients();
  return batch.ids.map((id) => clients.get(id)).filter((c) => c !== null);
});

export const countAllAdmin = query(async () => {
  await requireAdmin();
  return await User.countAll();
});

export const getUserAdmin = query.batch(userIdSchema, async (ids) => {
  await requireAdmin();
  const batch = await User.fromIds(ids);
  const rows = await batch.getClients();

  return (id) => rows.get(id) ?? e.error404();
});

export const getPrivilegesAdmin = query.batch(userIdSchema, async (ids) => {
  await requireAdmin();
  const batch = await User.fromIds(ids);
  const rows = await batch.getPrivileges();

  return (id) => rows.get(id) ?? [];
});
