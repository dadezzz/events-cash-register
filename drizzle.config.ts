import process from "node:process";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/lib/server/database/generated",
  schema: "./src/lib/server/database/tables/index.ts",
  dialect: "sqlite",
  dbCredentials: { url: process.env.DATABASE_URL ?? process.exit(1) },
});
