import { createRequire } from "node:module";
import type { CupsConnectionData, CupsPrinterData } from "./index.ts";

const require = createRequire(import.meta.url);
const lib = require("../build/cups.node");

export function httpConnectUri(url: string): Promise<CupsConnectionData> {
  return lib.httpConnectUri(url);
}

export function cupsGetDests(
  connection: CupsConnectionData,
): Promise<{ name: string; default: boolean; data: CupsPrinterData }[]> {
  return lib.cupsGetDests(connection);
}
