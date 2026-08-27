import { createRequire } from "node:module";
import type { CupsConnectionData, CupsPrinterData, CupsPrinterInfoData } from "./index.ts";
import type { JobCreationAttributesAvailable, JobCreationAttributesSelected, JobId } from "./utils.ts";

const require = createRequire(import.meta.url);
const lib = require("../../build/cups.node");

export function createConnection(url: string): Promise<CupsConnectionData> {
  return lib.createConnection(url);
}

export function getDests(connection: CupsConnectionData): Promise<{ name: string; data: CupsPrinterData }[]> {
  return lib.getDests(connection);
}

export function destGetInfo(connection: CupsConnectionData, dest: CupsPrinterData): Promise<CupsPrinterInfoData> {
  return lib.destGetInfo(connection, dest);
}

export function destGetJobCreationAttributes(
  connection: CupsConnectionData,
  dest: CupsPrinterData,
  info: CupsPrinterInfoData,
): JobCreationAttributesAvailable {
  const attributes: JobCreationAttributesAvailable = lib.destGetJobCreationAttributes(connection, dest, info);
  // Modern CUPS proxies can automatically handle any number of copies.
  attributes.push({ name: "copies", type: "number", constraints: { min: 1, max: 9999 }, default: 1 });
  return attributes;
}

export async function destSendJob(
  connection: CupsConnectionData,
  dest: CupsPrinterData,
  info: CupsPrinterInfoData,
  title: string,
  options: JobCreationAttributesSelected,
  documentMimeType: string,
  documentBuffer: Uint8Array,
): Promise<JobId> {
  return lib.destSendJob(connection, dest, info, title, options, documentMimeType, documentBuffer);
}
