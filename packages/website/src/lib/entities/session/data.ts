import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  createdAt: s.session.createdAt,
  ip: s.session.ip,
  lastUsedAt: s.session.lastUsedAt,
  userAgent: s.session.userAgent,
};

export type SessionData = InferColumnsDataTypes<typeof sqlDataColumns>;
