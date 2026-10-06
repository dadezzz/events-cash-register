import { inspect } from "node:util";
import { type HandleServerError, type ServerInit, sequence } from "@sveltejs/kit/hooks";
import { getSession } from "#lib/auth/index.server.ts";
import { initOrderCounter } from "#lib/entities/cart/order/index.ts";
import { initCreateAdmin } from "#lib/entities/user/admin.ts";
import { initCleanRateLimiterTableJob } from "#lib/server/cron/clean-rate-limiter-table.ts";
import { initCleanSessionTableJob } from "#lib/server/cron/clean-session-table.ts";
import { initRefreshAvailablePrintersJob } from "#lib/server/cron/refresh-available-printers.ts";
import { initMigrateDatabase } from "#lib/server/database/index.ts";
import { Logger } from "#lib/server/logger/index.ts";
import { logger as requestLogger } from "#lib/server/logger/request.ts";
import { errorStackForLog } from "#lib/server/logger/utils.ts";
import { building } from "$app/env";
import { ENABLE_CRON } from "$app/env/private";
import { initRefreshPrinters } from "./lib/entities/printer/index.ts";

export const handle = sequence(
  // Initialize RequestLogger.
  ({ event, resolve }) => {
    requestLogger.init();
    return resolve(event);
  },
  // This is needed to rotate session cookies without giving a 500 error page.
  // If the session cookie is rotated from a getSession call inside a remote
  // function, the request fails. So we do it here since this is called before
  // any remote function runs.
  async ({ event, resolve }) => {
    await getSession();
    return resolve(event);
  },
);

export const handleError: HandleServerError = ({ kind, error, issues }) => {
  const logger = requestLogger.get() ?? new Logger();

  switch (kind) {
    case "unknown":
      if (error instanceof Error) {
        logger.error({ kind, message: error.message, stack: errorStackForLog(error.stack) });
      } else {
        logger.error({ kind, message: "non-error value thrown", value: inspect(error) });
      }

      // Return a safe message, hiding internal details.
      return { message: "Internal Error" };

    case "app":
      logger.debug({ kind, message: error.message, status: error.status });
      // The { status, message } object is safe to pass through.
      return error;

    case "framework":
      // 404s, 405s, etc. are routine; avoid noisy logging.
      return error;

    case "validation":
      // `issues` is an array of validation problems.
      logger.debug({ kind, message: error.message, status: error.status, issues: issues.map((i) => i.message) });
      return error; // the generic { status, message } is safe
  }
};

export const init: ServerInit = async () => {
  if (!building) {
    await initMigrateDatabase();
    await initCreateAdmin();
    await initOrderCounter();
    await initRefreshPrinters();

    if (ENABLE_CRON) {
      initCleanRateLimiterTableJob();
      initCleanSessionTableJob();
      initRefreshAvailablePrintersJob();
    }
  }
};
