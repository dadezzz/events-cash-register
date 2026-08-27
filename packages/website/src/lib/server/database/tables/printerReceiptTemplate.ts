import { randomUUID } from "node:crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { PrinterId } from "#lib/entities/printer/id.ts";
import type { PrinterReceiptTemplateId } from "#lib/entities/printer/receipt-template/id.ts";
import type { RootBlockData } from "#lib/entities/printer/receipt-template/schema.ts";
import { json } from "./_utils.ts";
import printer from "./printer.ts";

export default sqliteTable("printerReceiptTemplate", {
  id: text()
    .$type<PrinterReceiptTemplateId>()
    .primaryKey()
    .$default(() => randomUUID() as PrinterReceiptTemplateId),

  name: text().notNull(),

  printerId: text()
    .$type<PrinterId>()
    .notNull()
    .references(() => printer.id, { onDelete: "cascade", onUpdate: "cascade" }),

  blocks: json().$type<RootBlockData>().notNull(),
});
