import type { InferColumnsDataTypes } from "drizzle-orm";
import { s } from "#lib/server/database/index.ts";

export const sqlDataColumns = {
  id: s.printer.id,
  name: s.printer.name,
};

export type PrinterData = InferColumnsDataTypes<typeof sqlDataColumns>;
