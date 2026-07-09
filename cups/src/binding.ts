import { createRequire } from "node:module";
import type { CupsConnectionData, CupsPrinterData, CupsPrinterInfoData } from "./index.ts";

const require = createRequire(import.meta.url);
const lib = require("../build/cups.node");

export function createConnection(url: string): Promise<CupsConnectionData> {
  return lib.createConnection(url);
}

export function getDests(connection: CupsConnectionData): Promise<{ name: string; data: CupsPrinterData }[]> {
  return lib.getDests(connection);
}

export function destGetInfo(connection: CupsConnectionData, dest: CupsPrinterData): Promise<CupsPrinterInfoData> {
  return lib.destGetInfo(connection, dest);
}

export function destSupportsMimeType(
  connection: CupsConnectionData,
  dest: CupsPrinterData,
  info: CupsPrinterInfoData,
  mimeType: string,
): boolean {
  return lib.destSupportsMimeType(connection, dest, info, mimeType);
}

export function destGetJobCreationAttributes(
  connection: CupsConnectionData,
  dest: CupsPrinterData,
  info: CupsPrinterInfoData,
): { name: string; valueTag: number; valueTagStr: string; values: unknown[] }[] {
  return lib.destGetJobCreationAttributes(connection, dest, info);
}
