import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  createdAt: s.user.createdAt,
  id: s.user.id,
  name: s.user.name,
  username: s.user.username,
};

export type UserData = InferColumnsDataTypes<typeof sqlDataColumns>;
