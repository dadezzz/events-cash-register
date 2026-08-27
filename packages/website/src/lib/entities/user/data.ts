import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  id: s.user.id,
  name: s.user.name,
  username: s.user.username,
  createdAt: s.user.createdAt,
};

export type UserData = InferColumnsDataTypes<typeof sqlDataColumns>;
