import { building } from "$app/env";

type LoggerDataValueSimple = string | number | boolean | undefined | bigint;
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

  private log(level: "debug" | "info" | "error" | "warn", data: LoggerData | string): void {
    // Avoid printing messages in the middle of the build.
    if (building) return;

    if (typeof data === "string") {
      data = { message: data };
    }

    console.log(
      JSON.stringify({
        ...this.data,
        ...data,
        time: new Date().toISOString(),
        level,
      }),
    );
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
