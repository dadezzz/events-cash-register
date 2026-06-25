import type { Logger } from "./index.ts";

export function logError(error: Error, logger: Logger) {
  let message = error.message;

  // Iterate over error causes.
  while (error.cause instanceof Error) {
    if (error.cause instanceof AggregateError) {
      console.error(error.cause.errors);
    } else {
      message += `: ${error.cause.message}`;
    }

    error = error.cause;
  }

  // We can't handle unknown errors, so we just log them to the console. In an
  // ideal world, everyone uses `Error` and this branch is never called.
  if (error.cause) {
    console.error(error.cause);
  }

  logger.error({ message, stack: error.stack });
}
