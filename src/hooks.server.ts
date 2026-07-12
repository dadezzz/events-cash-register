import type { HandleServerError, HandleValidationError, ServerInit } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { getSession } from "#lib/auth/index.server.ts";
import { initCreateAdmin } from "#lib/entities/user/admin.ts";
import { initCleanRateLimiterTableJob } from "#lib/server/cron/clean-rate-limiter-table.ts";
import { initCleanSessionTableJob } from "#lib/server/cron/clean-session-table.ts";
import { initUpdateAvailablePrintersJob } from "#lib/server/cron/update-available-printers.ts";
import { initMigrateDatabase } from "#lib/server/database/index.ts";
import { logError } from "#lib/server/logger/error.ts";
import { Logger } from "#lib/server/logger/index.ts";
import { logger } from "#lib/server/logger/request.ts";
import { building } from "$app/env";

export const handle = sequence(
  // Initialize RequestLogger.
  ({ event, resolve }) => {
    logger.init();
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

export const handleError: HandleServerError = ({ error }) => {
  if (error instanceof Error) {
    logError(new Error("internal error", { cause: error }), logger.get() ?? new Logger());
  } else {
    console.error(error);
  }
};

// No need to log query errors.
export const handleValidationError: HandleValidationError = () => {
  return { message: "bad request" };
};

export const init: ServerInit = async () => {
  if (!building) {
    await initMigrateDatabase();
    await initCreateAdmin();

    initCleanRateLimiterTableJob();
    initCleanSessionTableJob();
    initUpdateAvailablePrintersJob();
  }
};
