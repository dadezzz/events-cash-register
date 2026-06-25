import type { HandleServerError, HandleValidationError, ServerInit } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { logError } from "#lib/server/logger/error.ts";
import { Logger } from "#lib/server/logger/index.ts";
import { logger } from "#lib/server/logger/request.ts";
import { initMigrateDatabase } from "./lib/server/database";
import { initCreateAdmin } from "#lib/entities/user/admin.ts";
import { building } from "$app/env";

export const handle = sequence(
  // Initialize RequestLogger.
  ({ event, resolve }) => {
    logger.init();
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

export const init: ServerInit = async ()=> {
  if (!building) {

  await initMigrateDatabase()
  await initCreateAdmin()
  }
}
