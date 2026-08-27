import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  id: s.printerReceiptTemplate.id,
  printerId: s.printerReceiptTemplate.printerId,
  name: s.printerReceiptTemplate.name,
  blocks: s.printerReceiptTemplate.blocks,
};

export type PrinterReceiptTemplateData = InferColumnsDataTypes<typeof sqlDataColumns>;
