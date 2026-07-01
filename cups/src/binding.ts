import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const cups = require("../build/cups.node");

export function helloWorld(): string {
  return cups.helloWorld();
}
