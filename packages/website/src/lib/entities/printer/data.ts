import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  id: s.printer.id,
  name: s.printer.name,
  available: s.printer.available,
};

export type PrinterData = InferColumnsDataTypes<typeof sqlDataColumns>;
