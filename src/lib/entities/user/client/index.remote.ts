import { getUser, requireAdmin } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { UserBatch } from "../batch.ts";
import { userIdSchema } from "../id.ts";
import { User } from "../index.ts";
import { userPaginationSchema } from "../pagination.ts";
import { UserClient } from "./index.ts";

export const fromPaginationAdmin = query(userPaginationSchema, async (options) => {
  await requireAdmin();

  const batch = await UserBatch.fromPagination(options);
  const clients = await batch.getClients();

  // Need to preserve the order of ids.
  return batch.ids.map((id) => clients.get(id)).filter((c) => c !== null);
});

export const countAllAdmin = query(async () => {
  await requireAdmin();

  return await User.countAll();
});

export const fromIdAdmin = query.batch(userIdSchema, async (ids) => {
  await requireAdmin();

  const batch = await User.fromIds(ids);
  const rows = await batch.getClients();

  return (id) => rows.get(id) ?? e.error404();
});

export const fromSelf = query(async () => {
  const user = await getUser();
  if (!user) {
    return null;
  }

  return new UserClient(await user.getData());
});

export const getPrivilegesAdmin = query.batch(userIdSchema, async (ids) => {
  await requireAdmin();

  const batch = await User.fromIds(ids);
  const rows = await batch.getPrivileges();

  return (id) => rows.get(id) ?? [];
});
