import { defineEnvVars } from "@sveltejs/kit/env";
import * as v from "valibot";
import { Duration } from "#lib/duration.ts";
import { LOGGER_LEVELS_KEYS } from "#lib/server/logger/levels.ts";

const stringMillisecondsToDurationSchema = v.pipe(
  v.string(),
  v.digits(),
  v.transform((i) => Duration.fromMilliseconds(Number.parseInt(i, 10))),
);

const stringToUrlSchema = v.pipe(
  v.string(),
  v.url(),
  v.transform((i) => new URL(i)),
);

const booleanSchema = v.pipe(
  v.string(),
  v.picklist(["true", "false"]),
  v.transform((i) => i === "true"),
);

export const variables = defineEnvVars({
  SESSION_COOKIE_NAME: {
    description: "Name of the session cookie",
    static: true,
  },
  SESSION_MAX_AGE: {
    description: "Max duration for the session (including renovations)",
    schema: stringMillisecondsToDurationSchema,
    // static:true // Not enabled since transport hooks don't seem to run on static vars.
  },
  SESSION_EXPIRE_AFTER: {
    description: "Duration of inactivity period after which user must reauthenticate",
    schema: stringMillisecondsToDurationSchema,
    // static:true
  },
  SESSION_RENOVATE_AFTER: {
    description: "Duration after which the session token is rotated",
    schema: stringMillisecondsToDurationSchema,
    // static:true
  },

  DATABASE_URL: {
    description: "Url of the sqlite database",
  },
  DATABASE_LOG_QUERIES: {
    description: "Whether to log database queries",
    schema: v.pipe(
      v.picklist(["true", "false"]),
      v.transform((i) => i === "true"),
    ),
  },
  DATABASE_MIGRATIONS_FOLDER: {
    description: "Path to folder containing migrations sql files",
    static: true,
  },

  CUPS_URL: {
    description: "Url of the CUPS server",
    schema: stringToUrlSchema,
  },

  PUPPETEER_EXECUTABLE_PATH: {
    description: "Path to chromium executable for puppeteer",
    static: true,
  },

  INITIAL_ADMIN_NAME: {
    description: "Name for the initial admin user",
  },
  INITIAL_ADMIN_PASSWORD: {
    description: "Password for the initial admin user",
  },
  INITIAL_ADMIN_USERNAME: {
    description: "Username for the initial admin user",
  },

  LOGGER_MIN_LEVEL: {
    description: "Filters logs below this level",
    schema: v.pipe(v.string(), v.picklist(LOGGER_LEVELS_KEYS)),
    static: true,
  },
  LOGGER_PRETTY: {
    description: "Whether to enable readable logs instead of json",
    schema: booleanSchema,
    static: true,
  },

  ENABLE_CRON: {
    description: "Whether to enable cron jobs",
    schema: booleanSchema,
    static: true,
  },
});
