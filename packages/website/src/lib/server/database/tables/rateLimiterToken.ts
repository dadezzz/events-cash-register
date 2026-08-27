import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./_utils.ts";

const columns = {
  // Each rate limiter should use a different bucketGroup, then for each client
  // identifier it creates a bucket of tokens inside that group.
  bucket: text().notNull(),
  bucketGroup: text().notNull(),

  // Keep track of the creation time, not expiration, this way if we change the
  // times on the application config, the change also applies to already created
  // tokens.
  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
};

// Tokens represent usage of a resorce that is limited. Once the user reaches
// the maximum quota of tokens, they will not be allowed to proceed.
export default sqliteTable(
  "rateLimiterToken",
  columns,

  // A combination of the three should be unique.
  (t) => [primaryKey({ columns: [t.bucketGroup, t.bucket, t.createdAt] })],
);
