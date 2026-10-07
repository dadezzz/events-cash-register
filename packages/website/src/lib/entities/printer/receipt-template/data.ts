import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  id: s.receiptTemplate.id,
  printerId: s.receiptTemplate.printerId,
  name: s.receiptTemplate.name,
  blocks: s.receiptTemplate.blocks,
};

export type PrinterReceiptTemplateData = InferColumnsDataTypes<typeof sqlDataColumns>;
