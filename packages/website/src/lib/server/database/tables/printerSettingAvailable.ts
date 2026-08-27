import type { JobCreationAttributesAvailable } from "@workspace/cups/utils";
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
  type: text().$type<JobCreationAttributesAvailable[number]["type"]>().notNull(),
  constraints: json().$type<JobCreationAttributesAvailable[number]["constraints"]>().notNull(),
  default: json().$type<JobCreationAttributesAvailable[number]["default"]>().notNull(),
};

export default sqliteTable("printerSettingAvailable", columns, (t) => [
  primaryKey({ columns: [t.printerId, t.name] }),
  index("printerSettingAvailable_printerId").on(t.printerId),
]);
