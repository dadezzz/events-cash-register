import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export default sqliteTable("orderCounter", {
  // For now this is all in the same event. In the future we can distinguish them.
  event: text().primaryKey(),
  value: integer().notNull().default(0),
});
