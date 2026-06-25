import type { UUID } from "node:crypto";
import type { InferColumnsDataTypes } from "drizzle-orm";
import { and, gte } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";
import { SESSION_EXPIRE_AFTER, SESSION_MAX_AGE } from "$app/env/private";

export type SessionId = UUID & { __brand: "SessionId" };
export type SessionIdHash = string & { __brand: "SessionIdHash" };

export const headersToHash = ["user-agent", "cf-ipcountry"];

export const sqlDataColumns = {
  createdAt: s.session.createdAt,
  ip: s.session.ip,
  lastUsedAt: s.session.lastUsedAt,
  userAgent: s.session.userAgent,
};

export type SessionData = InferColumnsDataTypes<typeof sqlDataColumns>;

export const sqlSessionNotExpired = and(
  // Checks that the session isn't older than a maximum lifetime. This
  // prevents having sessions that last forever.
  gte(s.session.createdAt, new Date(Date.now() - SESSION_MAX_AGE.asMilliseconds())),
  // Checks that the session has been recently used. Otherwise it is
  // better if the user authenticates again.
  gte(s.session.renovatedAt, new Date(Date.now() - SESSION_EXPIRE_AFTER.asMilliseconds())),
);
