import { getRequestClientIp } from "#lib/server/request.ts";
import { getRequestEvent } from "$app/server";
import { Logger, type LoggerData, type LoggerDataValue } from "./index.ts";

class RequestLogger extends Logger {
  localsKey = Symbol();

  init() {
    const event = getRequestEvent();
    const logger = new Logger();

    logger.setData("clientIp", getRequestClientIp());
    logger.setData("requestMethod", event.request.method);
    logger.setData("requestPath", event.url.pathname);

    // @ts-expect-error bad sveltekit types :/
    event.locals[this.localsKey] = logger;
  }

  get(): Logger | null {
    // @ts-expect-error bad sveltekit types :/
    const logger = getRequestEvent().locals[this.localsKey];
    return logger ?? null;
  }

  setData(key: string, value: LoggerDataValue): void {
    this.get()?.setData(key, value);
  }

  deleteData(key: string): void {
    this.get()?.deleteData(key);
  }

  info(data: LoggerData | string): void {
    this.get()?.info(data);
  }

  warn(data: LoggerData | string): void {
    this.get()?.warn(data);
  }

  error(data: LoggerData | string): void {
    this.get()?.error(data);
  }
}

export const logger = new RequestLogger();
