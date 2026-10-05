import { inspect } from "node:util";
import { building } from "$app/env";
import { LOGGER_MIN_LEVEL, LOGGER_PRETTY } from "$app/env/private";
import { LOGGER_LEVELS, LOGGER_LEVELS_KEYS, type LoggerLevel } from "./levels.ts";

type LoggerDataValueSimple = string | number | boolean | undefined | bigint | string[];
export type LoggerDataValue = LoggerDataValueSimple | Record<string, LoggerDataValueSimple>;
export type LoggerData = Record<string, LoggerDataValue>;

export class Logger {
  private data: LoggerData = {};

  setData(key: string, value: LoggerDataValue): void {
    this.data[key] = value;
  }

  deleteData(key: string): void {
    delete this.data[key];
  }

  private log(level: LoggerLevel, data: LoggerData | string): void {
    if (building || LOGGER_LEVELS_KEYS.indexOf(level) < LOGGER_LEVELS_KEYS.indexOf(LOGGER_MIN_LEVEL)) {
      return;
    }

    if (typeof data === "string") {
      data = { message: data };
    }

    const time = new Date().toISOString();

    if (LOGGER_PRETTY) {
      const { message, ...rest } = { ...this.data, ...data };
      const messageStr = message?.toString().replaceAll("\n", "  ");
      const levelStr = `${LOGGER_LEVELS[level]}`;

      console.log(
        `${levelStr} \x1b[37m[${time}]\x1b[0m ${messageStr}` +
          (Object.entries(rest).length !== 0
            ? `  ${inspect(rest, { breakLength: Infinity }).replaceAll("\n", "\n    ")}`
            : ""),
      );
    } else {
      console.log(JSON.stringify({ ...this.data, ...data, time, level }));
    }
  }

  debug(data: LoggerData | string): void {
    this.log("debug", data);
  }

  info(data: LoggerData | string): void {
    this.log("info", data);
  }

  error(data: LoggerData | string): void {
    this.log("error", data);
  }

  warn(data: LoggerData | string): void {
    this.log("warn", data);
  }
}
