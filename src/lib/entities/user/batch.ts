import { inArray } from "drizzle-orm";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { User as UserClient } from "./client/index.ts";
import { sqlDataColumns } from "./data.ts";
import type { UserId } from "./id.ts";
import type { UserPrivilege } from "./index.ts";

export class UserBatch extends Batch<UserId> {
  async getClients(): Promise<BatchRows<UserId, UserClient>> {
    const rows = await db.select(sqlDataColumns).from(s.user).where(inArray(s.user.id, this.ids));
    return new BatchRows(rows.map((r) => [r.id, new UserClient(r)]));
  }

  async getPrivileges(): Promise<BatchRows<UserId, UserPrivilege[]>> {
    const rows = await db
      .select({ userId: s.userPrivilege.userId, privilege: s.userPrivilege.privilege })
      .from(s.userPrivilege)
      .where(inArray(s.userPrivilege.userId, this.ids));

    const rows2: Record<UserId, UserPrivilege[]> = {};
    for (const r of rows) {
      rows2[r.userId] ??= [];
      rows2[r.userId].push(r.privilege);
    }

    return new BatchRows(rows2);
  }
}
