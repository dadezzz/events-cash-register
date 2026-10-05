import { inspect } from "node:util";
import { Cron } from "croner";
import { Logger } from "#lib/server/logger/index.ts";

type CronCallbackContext = {
  logger: Logger;
};

type CronCallback = (context: CronCallbackContext) => Promise<void> | void;

export function job(name: string, pattern: string, fn: CronCallback) {
  const logger = new Logger();
  logger.setData("job", name);

  const job = new Cron(
    pattern,
    {
      catch: (error) => {
        if (error instanceof Error) {
          logger.error({ kind: "cron", message: error.message, stack: error.stack });
        } else {
          logger.error({ kind: "cron", message: "non-error value thrown", value: inspect(error) });
        }
      },
      context: { logger },
      mode: "6-part",
      legacyMode: false,
    },
    async (self) => {
      // biome-ignore lint/style/noNonNullAssertion: Context is passed above.
      const result = await fn(self.options.context!);
      logger.debug(`next run is scheduled at ${self.nextRun()?.toISOString()}`);
      return result;
    },
  );

  logger.debug(`next run is scheduled at ${job.nextRun()?.toISOString()}`);
}
