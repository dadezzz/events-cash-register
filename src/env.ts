import { defineEnvVars } from "@sveltejs/kit/hooks";
import * as v from "valibot";
import { Duration } from "#lib/duration.ts";

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

const integerSchema = v.pipe(
  v.string(),
  v.digits(),
  v.transform((i) => Number.parseInt(i, 10)),
);

const booleanSchema = v.pipe(
  v.string(),
  v.picklist(["true", "false"]),
  v.transform((i) => i === "true"),
);

export const variables = defineEnvVars({
  DOMAIN: {
    description: "DNS domain of the application",
    static: true,
  },
  ORIGIN: {
    description: "Web origin of the application",
    schema: stringToUrlSchema,
    static: true,
  },

  SESSION_COOKIE_NAME: {
    description: "Name of the session cookie",
  },
  SESSION_MAX_AGE: {
    description: "Max duration for the session (including renovations)",
    schema: stringMillisecondsToDurationSchema,
  },
  SESSION_EXPIRE_AFTER: {
    description: "Duration of inactivity period after which user must reauthenticate",
    schema: stringMillisecondsToDurationSchema,
  },
  SESSION_RENOVATE_AFTER: {
    description: "Duration after which the session token is rotated",
    schema: stringMillisecondsToDurationSchema,
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
  },

  CUPS_URL: {
    description: "Url of the CUPS server",
  },

  PUPPETEER_EXECUTABLE_PATH: {
    description: "Path to chromium executable for puppeteer",
  },

  ADMIN_USERS_PAGE_SIZE: {
    description: "User entries per page in admin dashboard",
    schema: integerSchema,
    static: true,
    public: true,
  },
  ADMIN_PRODUCTS_PAGE_SIZE: {
    description: "Product entries per page in admin dashboard",
    schema: integerSchema,
    static: true,
    public: true,
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

  ENABLE_CRON: {
    description: "Whether to enable cron jobs",
    schema: booleanSchema,
    static: true,
  },
});
