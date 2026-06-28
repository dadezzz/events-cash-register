import * as argon2 from "@node-rs/argon2";
import { and, desc, eq } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import { SessionBatch } from "#lib/entities/session/batch.ts";
import { NewSession } from "#lib/entities/session/index.ts";
import { type SessionId, sqlSessionNotExpired } from "#lib/entities/session/utils.ts";
import { db, s } from "#lib/server/database/index.ts";
import { sqlDataColumns, type UserData } from "./data.ts";
import type { UserId, UserPrivilege } from "./id.ts";

export class User {
  readonly id: UserId;

  constructor(id: UserId) {
    this.id = id;
  }

  static async fromUsernameAndPassword(username: string, password: string): Promise<User | null> {
    const user = await db
      .select({ id: s.user.id, passwordHash: s.user.passwordHash })
      .from(s.user)
      .where(eq(s.user.username, username))
      .then(getFirstOptional);

    if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, password))) {
      return null;
    }

    return new User(user.id);
  }

  async createSession(): Promise<NewSession> {
    return NewSession.create(this);
  }

  async createSessionCookie(): Promise<void> {
    const session = await this.createSession();
    session.setCookie();
  }

  async deleteSession(id: SessionId): Promise<void> {
    await db.delete(s.session).where(and(eq(s.session.id, id), eq(s.session.userId, this.id)));
  }

  async deleteAllSessions(): Promise<void> {
    await db.delete(s.session).where(eq(s.session.userId, this.id));
  }

  async getProfile(): Promise<UserData> {
    return await db.select(sqlDataColumns).from(s.user).where(eq(s.user.id, this.id)).then(getFirstOrThrow);
  }

  async updateProfile(profile: { name?: string; username?: string; password?: string }): Promise<void> {
    await db
      .update(s.user)
      .set({
        ...profile,
        passwordHash: profile.password ? await argon2.hash(profile.password) : undefined,
      })
      .where(eq(s.user.id, this.id));
  }

  async addPrivilege(privilege: UserPrivilege): Promise<void> {
    await db.insert(s.userPrivilege).values({ userId: this.id, privilege });
  }

  async revokePrivilege(privilege: UserPrivilege): Promise<void> {
    await db
      .delete(s.userPrivilege)
      .where(and(eq(s.userPrivilege.userId, this.id), eq(s.userPrivilege.privilege, privilege)));
  }

  async getPrivileges(): Promise<UserPrivilege[]> {
    return db
      .select({ privilege: s.userPrivilege.privilege })
      .from(s.userPrivilege)
      .where(eq(s.userPrivilege.userId, this.id))
      .then((r) => r.map((u) => u.privilege));
  }

  async hasPrivilege(privilege: UserPrivilege): Promise<boolean> {
    return (await this.getPrivileges()).includes(privilege);
  }

  async delete(): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(s.session).where(eq(s.session.userId, this.id));
      await tx.update(s.user).set({ passwordHash: null }).where(eq(s.user.id, this.id));
    });
  }

  async getSessions(): Promise<SessionBatch> {
    const ids = await db
      .select({ id: s.session.id })
      .from(s.session)
      .where(and(sqlSessionNotExpired, eq(s.session.userId, this.id)))
      .orderBy(desc(s.session.createdAt))
      .then((r) => r.map((s) => s.id));

    return new SessionBatch(ids);
  }
}
