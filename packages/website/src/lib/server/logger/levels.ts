export const LOGGER_LEVELS = {
  trace: "\x1b[30;1mTRACE\x1b[0m",
  debug: "\x1b[37;1mDEBUG\x1b[0m",
  info: "\x1b[34;1mINFO\x1b[0m",
  warn: "\x1b[33;1mWARN\x1b[0m",
  error: "\x1b[31;1mERROR\x1b[0m",
};

export type LoggerLevel = keyof typeof LOGGER_LEVELS;
export const LOGGER_LEVELS_KEYS = Object.keys(LOGGER_LEVELS);
