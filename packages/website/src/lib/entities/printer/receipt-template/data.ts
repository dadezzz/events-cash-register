import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  blocks: s.receiptTemplate.blocks,
  id: s.receiptTemplate.id,
  name: s.receiptTemplate.name,
  printerId: s.receiptTemplate.printerId,
};

export type PrinterReceiptTemplateData = InferColumnsDataTypes<typeof sqlDataColumns>;
