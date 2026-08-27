import type { JobCreationAttributesSelected } from "@workspace/cups/utils";
import { index, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { PrinterId } from "#lib/entities/printer/id.ts";
import { json } from "./_utils.ts";
import printer from "./printer.ts";

const columns = {
  printerId: text()
    .$type<PrinterId>()
    .notNull()
    .references(() => printer.id, { onDelete: "cascade", onUpdate: "cascade" }),

  name: text().notNull(),
  value: json().$type<JobCreationAttributesSelected[number]["value"]>().notNull(),
};

export default sqliteTable("printerSettingSelected", columns, (t) => [
  primaryKey({ columns: [t.printerId, t.name] }),
  index("printerSettingSelected_printerId").on(t.printerId),
]);
