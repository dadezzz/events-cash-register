import { and, eq, inArray } from "drizzle-orm";
import type { User } from "#lib/entities/user/index.ts";
import { Batch, BatchRows } from "#lib/server/batch.ts";
import { db, s } from "#lib/server/database/index.ts";
import { type SessionData, sqlDataColumns } from "./data.ts";
import type { SessionId } from "./id.ts";
import { sqlSessionNotExpired } from "./utils.ts";

/** Allows to perform batch operations on an arbitrary set of sessions. */
export class SessionBatch extends Batch<SessionId> {
  /** Validates that the provided session ids belong to the specified user. */
  static async forUser(user: User, ids: SessionId[]): Promise<SessionBatch> {
    const validIds = await db
      .select({ id: s.session.id })
      .from(s.session)
      .where(and(sqlSessionNotExpired, eq(s.session.userId, user.id), inArray(s.session.id, ids)))
      .then((r) => r.map((s) => s.id));

    return new SessionBatch(validIds);
  }

  /** Returns data that can be displayed in the UI. */
  async getData(): Promise<BatchRows<SessionId, SessionData>> {
    const rows = await db
      .select({ id: s.session.id, ...sqlDataColumns })
      .from(s.session)
      .where(inArray(s.session.id, this.ids));

    return new BatchRows(rows.map(({ id, ...data }) => [id, data]));
  }
}
