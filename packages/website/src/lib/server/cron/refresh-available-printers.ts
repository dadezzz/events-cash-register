import { randomInt } from "node:crypto";
import { availablePrinters } from "#lib/entities/printer/available.ts";
import { Printer } from "#lib/entities/printer/index.ts";
import { job } from "./index.ts";

export function initRefreshAvailablePrintersJob() {
  job("refresh available printers", `${randomInt(59)} */1 * * * *`, async ({ logger }) => {
    const availableCountBefore = availablePrinters.size;
    await Printer.updateAvailable();
    const availableCountAfter = availablePrinters.size;
    logger.info({ message: "updated printers count", delta: availableCountAfter - availableCountBefore });
  });
}
