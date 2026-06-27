import process from "node:process";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: process.env.DATABASE_MIGRATIONS_FOLDER ?? process.exit(1),
  schema: "./src/lib/server/database/tables/index.ts",
  dialect: "sqlite",
  dbCredentials: { url: process.env.DATABASE_URL ?? process.exit(1) },
});
