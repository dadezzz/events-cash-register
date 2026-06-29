import { Session } from "#lib/entities/session/index.ts";
import { AdminUser } from "#lib/entities/user/admin.ts";
import type { User } from "#lib/entities/user/index.ts";
import { Operator } from "#lib/entities/user/operator.ts";
import { e } from "#lib/error.ts";
import { LocalsCache } from "#lib/server/locals-cache.ts";
import { getRequestEvent } from "$app/server";

const requestSession = new LocalsCache<Session | null>("session", () => Session.fromCookie());

export function getSession() {
  return requestSession.get();
}

const requestUser = new LocalsCache<User | null>("user", async () => {
  const session = await getSession();
  if (!session) return null;
  return session.user;
});

export async function getUser(): Promise<User | null> {
  return await requestUser.get();
}

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (user) return user;
  throw e.requireSignIn(getRequestEvent().url.pathname);
}

export async function getOperator(): Promise<Operator | null> {
  const user = await getUser();

  if (user) {
    return new Operator(user);
  }

  return null;
}

export async function requireOperator(): Promise<Operator> {
  const operator = await getOperator();
  if (operator) return operator;
  throw e.requireSignIn(getRequestEvent().url.pathname);
}

const requestAdmin = new LocalsCache<AdminUser | null>("admin", async () => {
  const user = await getUser();
  if (!user) return null;
  return await AdminUser.fromUser(user);
});

export async function getAdmin(): Promise<AdminUser | null> {
  return requestAdmin.get();
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (admin) return admin;
  throw e.requireSignIn(getRequestEvent().url.pathname);
}
