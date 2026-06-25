import { query } from "$app/server";
import * as server from "./index.server.ts";

export const isAuthenticated = query(async () => {
  const user = await server.getUser();
  return user !== null;
});

export const requireAuthenticated = query(async () => {
  await server.requireUser();
});

export const isAdmin = query(async () => {
  const admin = await server.getAdmin();
  return admin !== null;
});

export const requireAdmin = query(async () => {
  await server.requireAdmin();
});
