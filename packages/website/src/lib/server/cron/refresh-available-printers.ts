import { randomInt } from "node:crypto";
import { Printer } from "#lib/entities/printer/index.ts";
import { job } from "./index.ts";

export function initRefreshAvailablePrintersJob() {
  job("refresh available printers", `${randomInt(59)} */1 * * * *`, async ({ logger }) => {
    await Printer.refreshAvailable();
    logger.debug({ message: "refreshed printers" });
  });
}
