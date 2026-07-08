import { randomUUID } from "node:crypto";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { SessionId, SessionIdHash } from "#lib/entities/session/id.ts";
import type { UserId } from "#lib/entities/user/id.ts";
import { timestamp } from "./_utils.ts";
import user from "./user.ts";

const columns = {
  // Can be safely sent to the user since it's not used for authentication of
  // requests.
  id: text()
    .$type<SessionId>()
    .primaryKey()
    .$default(() => randomUUID() as SessionId),
  // Hash of the secret stored in the client's cookie + values of some headers to
  // fix the session to a particular user agent or country.
  hashedSecret: text().$type<SessionIdHash>().notNull().unique(),

  userId: text()
    .$type<UserId>()
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),

  // Tracks the time since the session was created for the first time, it isn't
  // updated when the session token is rotated and allows to set a maximum
  // lifetime after which a session cannot be renovated anymore.
  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
  // This is updated each time a session is renovated.
  // Two threesholds depend on the renovatedAt time:
  //
  // 1. If a session isn't renovated before a certain time, then it was inactive
  //    and it can be deleted.
  // 2. After some time, the session can be renovated again to let it stay
  //    active.
  renovatedAt: timestamp()
    .notNull()
    .$default(() => new Date()),
  // Updated each time the session is validated.
  lastUsedAt: timestamp()
    .notNull()
    .$default(() => new Date()),

  // Save some informations that can be displayed to the user, so that they can
  // hopefully recognize the device where the session has been created.
  userAgent: text().notNull(),
  ip: text().notNull(),
};

export default sqliteTable("session", columns, (t) => [
  index("session_userId").on(t.userId),
  index("session_hashedSecret").on(t.hashedSecret),
]);
