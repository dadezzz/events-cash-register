import { randomUUID } from "node:crypto";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { PrinterId } from "#lib/entities/printer/id.ts";

const columns = {
  id: text()
    .$type<PrinterId>()
    .primaryKey()
    .$default(() => randomUUID() as PrinterId),
  name: text().notNull(),
};

export default sqliteTable("printer", columns, (t) => [index("printer_name").on(t.name)]);
