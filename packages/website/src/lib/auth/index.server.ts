import { Session } from "#lib/entities/session/index.ts";
import { AdminUser } from "#lib/entities/user/admin.ts";
import type { User } from "#lib/entities/user/index.ts";
import { e } from "#lib/error.ts";
import { LocalsCache } from "#lib/server/locals-cache.ts";

const requestSession = new LocalsCache<Session | null>("session", () => Session.fromCookie());

export function getSession() {
  return requestSession.get();
}

const requestUser = new LocalsCache<User | null>("user", async () => {
  const session = await getSession();
  if (!session) return null;
  return session.user;
});

export function getUser(): Promise<User | null> {
  return requestUser.get();
}

export async function requireUser(redirectPath: string = "/"): Promise<User> {
  const user = await getUser();
  if (user) return user;
  throw e.requireSignIn(redirectPath);
}

const requestAdmin = new LocalsCache<AdminUser | null>("admin", async () => {
  const user = await getUser();
  if (!user) return null;
  return await AdminUser.fromUser(user);
});

export function getAdmin(): Promise<AdminUser | null> {
  return requestAdmin.get();
}

export async function requireAdmin(redirectPath: string = "/"): Promise<AdminUser> {
  const admin = await getAdmin();
  if (admin) return admin;
  throw e.requireSignIn(redirectPath);
}
