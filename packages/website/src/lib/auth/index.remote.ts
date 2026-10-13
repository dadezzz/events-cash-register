import { query } from "$app/server";
import * as server from "./index.server.ts";

export const getUserId = query(async () => {
  const user = await server.getUser();
  return user?.id ?? null;
});

export const getAdminUserId = query(async () => {
  const admin = await server.getAdmin();
  return admin?.user.id ?? null;
});
