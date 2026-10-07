import type { JobCreationAttributesSelected } from "@workspace/cups/utils";
import { index, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { PrinterReceiptTemplateId } from "#lib/entities/printer/receipt-template/id.ts";
import { json } from "./_utils.ts";
import receiptTemplate from "./receiptTemplate.ts";

const columns = {
  receiptTemplateId: text()
    .$type<PrinterReceiptTemplateId>()
    .notNull()
    .references(() => receiptTemplate.id, { onDelete: "cascade", onUpdate: "cascade" }),

  name: text().notNull(),
  value: json().$type<JobCreationAttributesSelected[number]["value"]>().notNull(),
};

export default sqliteTable("printerSettingSelected", columns, (t) => [
  primaryKey({ columns: [t.receiptTemplateId, t.name] }),
  index("printerSettingSelected_receiptTemplateId").on(t.receiptTemplateId),
]);
