import { randomUUID } from "node:crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { PrinterId } from "#lib/entities/printer/id.ts";
import { boolean } from "./_utils.ts";

export default sqliteTable("printer", {
  id: text()
    .$type<PrinterId>()
    .primaryKey()
    .$default(() => randomUUID() as PrinterId),
  name: text().unique().notNull(),
  available: boolean().notNull().default(false),
});
