import type { UUID } from "node:crypto";
import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export type UserId = UUID & { __brand: "UserId" };

export type UserPrivilege = "ADMIN";

export const sqlDataColumns = {
  id: s.user.id,
  name: s.user.name,
  username: s.user.username,
  createdAt: s.user.createdAt,
};

export type UserData = InferColumnsDataTypes<typeof sqlDataColumns>;

/**
 * A credential represents one of the ways with which an user can authenticate
 * itself.
 */
export interface UserCredential {
  /**
   * Can be an encrypted password or an openId sub.
   */
  key: string;
}
