import { randomInt } from "node:crypto";
import { Cron } from "croner";
import { availablePrinters } from "#lib/entities/printer/available.ts";
import { Printer } from "#lib/entities/printer/index.ts";
import { logError } from "#lib/server/logger/error.ts";
import { Logger } from "#lib/server/logger/index.ts";

const logger = new Logger();
logger.setData("job", "update-available-printers");

const job = new Cron(
  `${randomInt(59)} */1 * * * *`,
  async () => {
    const availableCountBefore = availablePrinters.size;
    await Printer.updateAvailable();
    const availableCountAfter = availablePrinters.size;
    logger.info(`updated printers count: ${availableCountAfter - availableCountBefore}`);
  },
  {
    paused: true,
    catch: (e) => {
      if (e instanceof Error) {
        logError(e, logger);
      } else {
        console.error(e);
      }
    },
  },
);

export function initUpdateAvailablePrintersJob() {
  job.resume();
  logger.info(`next run is scheduled at ${job.nextRun()?.toISOString()}`);
}
