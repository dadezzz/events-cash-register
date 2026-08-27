import { and, gte } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";
import { SESSION_EXPIRE_AFTER, SESSION_MAX_AGE } from "$app/env/private";

export const sqlSessionNotExpired = and(
  // Checks that the session isn't older than a maximum lifetime. This
  // prevents having sessions that last forever.
  gte(s.session.createdAt, new Date(Date.now() - SESSION_MAX_AGE.asMilliseconds())),
  // Checks that the session has been recently used. Otherwise it is
  // better if the user authenticates again.
  gte(s.session.renovatedAt, new Date(Date.now() - SESSION_EXPIRE_AFTER.asMilliseconds())),
);
