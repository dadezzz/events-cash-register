import { desc } from "drizzle-orm";
import { db, s } from "#lib/server/database/index.ts";
import { Logger } from "#lib/server/logger/index.ts";
import { INITIAL_ADMIN_NAME, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_USERNAME } from "$app/env/private";
import { ADMIN_USERS_PAGE_SIZE } from "$app/env/public";
import { UserBatch } from "./batch.ts";
import { User } from "./index.ts";

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

  async getAllUsers(page: number): Promise<UserBatch> {
    const ids = await db
      .select({ id: s.user.id })
      .from(s.user)
      .orderBy(desc(s.user.createdAt))
      .limit(ADMIN_USERS_PAGE_SIZE)
      .offset((page - 1) * ADMIN_USERS_PAGE_SIZE)
      .then((r) => r.map((u) => u.id));

    return new UserBatch(ids);
  }

  async countAllUsers(): Promise<number> {
    return await db.$count(s.user);
  }
}

export async function initCreateAdmin() {
  // If there aren't any users in the system, a default one is created.
  if ((await db.$count(s.user)) === 0) {
    const admin = await User.create({
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
