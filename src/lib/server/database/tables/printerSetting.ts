import { index, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { PrinterId } from "#lib/entities/printer/id.ts";
import type { PrinterSettingDataColumn } from "#lib/entities/printer/index.ts";
import { json } from "./_utils.ts";
import printer from "./printer.ts";

const columns = {
  printerId: text()
    .$type<PrinterId>()
    .notNull()
    .references(() => printer.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text().notNull(),
  data: json().$type<PrinterSettingDataColumn>().notNull(),
};

export default sqliteTable("printerSetting", columns, (t) => [
  primaryKey({ columns: [t.printerId, t.name] }),
  index("printerSetting_printerName").on(t.printerId),
]);
