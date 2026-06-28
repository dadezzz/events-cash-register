import * as argon2 from "@node-rs/argon2";
import { asc, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import type { PaginationOptions } from "#lib/pagination.ts";
import { db, s } from "#lib/server/database/index.ts";
import { Logger } from "#lib/server/logger/index.ts";
import { INITIAL_ADMIN_NAME, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_USERNAME } from "$app/env/private";
import { ADMIN_USERS_PAGE_SIZE } from "$app/env/public";
import { UserBatch } from "./batch.ts";
import type { UserId } from "./id.ts";
import { User } from "./index.ts";
import type { PaginationSortColumn } from "./pagination.ts";

export class AdminUser {
  readonly user: User;

  constructor(user: User) {
    this.user = user;
  }

  static async fromUser(user: User): Promise<AdminUser | null> {
    if (await user.hasPrivilege("ADMIN")) {
      return new AdminUser(user);
    } else {
      return null;
    }
  }

  async verifyUsername(username: string): Promise<boolean> {
    const count = await db.$count(s.user, eq(s.user.username, username));
    return count > 0;
  }

  async addUser(profile: { name: string; username: string; password: string }): Promise<User> {
    const user = await db
      .insert(s.user)
      .values({ ...profile, passwordHash: await argon2.hash(profile.password) })
      .returning({ id: s.user.id })
      .then(getFirstOrThrow);

    return new User(user.id);
  }

  async getUser(id: UserId): Promise<User | null> {
    const user = await db.select({ id: s.user.id }).from(s.user).where(eq(s.user.id, id)).then(getFirstOptional);
    return user ? new User(user.id) : null;
  }

  async getUsers(ids: UserId[]): Promise<UserBatch> {
    const users = await db.select({ id: s.user.id }).from(s.user).where(inArray(s.user.id, ids));
    return new UserBatch(users.map((u) => u.id));
  }

  async getAllUsers(options: PaginationOptions<PaginationSortColumn>): Promise<UserBatch> {
    const users = await db
      .select({ id: s.user.id })
      .from(s.user)
      // Return only non-deleted users.
      .where(isNotNull(s.user.passwordHash))
      .orderBy(options.sortDirection === "desc" ? desc(s.user[options.sortColumn]) : asc(s.user[options.sortColumn]))
      .limit(ADMIN_USERS_PAGE_SIZE)
      .offset((options.page - 1) * ADMIN_USERS_PAGE_SIZE);

    return new UserBatch(users.map((u) => u.id));
  }

  async countAllUsers(): Promise<number> {
    // Consider only non-deleted users.
    return await db.$count(s.user, isNotNull(s.user.passwordHash));
  }
}

export async function initCreateAdmin() {
  const tmpUser = new User("" as UserId);
  const tmpAdmin = new AdminUser(tmpUser);

  // If there aren't any users in the system, a default one is created.
  if ((await db.$count(s.user)) === 0) {
    const admin = await tmpAdmin.addUser({
      name: INITIAL_ADMIN_NAME,
      password: INITIAL_ADMIN_PASSWORD,
      username: INITIAL_ADMIN_USERNAME,
    });
    await admin.addPrivilege("ADMIN");

    const logger = new Logger();
    logger.info("found 0 users in the system");
    logger.info({
      message: "created new default admin user",
      username: INITIAL_ADMIN_USERNAME,
      password: INITIAL_ADMIN_PASSWORD,
    });
  }
}
