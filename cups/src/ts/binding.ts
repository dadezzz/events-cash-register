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

export function destCheckMimeTypeSupport(
  connection: CupsConnectionData,
  dest: CupsPrinterData,
  info: CupsPrinterInfoData,
  mimeType: string,
): boolean {
  return lib.destCheckMimeTypeSupport(connection, dest, info, mimeType);
}

export function destGetJobCreationAttributes(
  connection: CupsConnectionData,
  dest: CupsPrinterData,
  info: CupsPrinterInfoData,
): JobCreationAttributesAvailable {
  return lib.destGetJobCreationAttributes(connection, dest, info);
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
