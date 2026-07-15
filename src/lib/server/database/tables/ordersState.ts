import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { json } from "./_utils.ts";

// Used to track global state like order counter, etc.
export default sqliteTable("ordersState", {
  key: text().notNull().primaryKey(),
  value: json().notNull(),
});
