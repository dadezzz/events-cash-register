import type { CupsPrinter } from "@workspace/cups";
import type { Printer } from "./index.ts";

export const availablePrinters: { cups: CupsPrinter; db: Printer }[] = [];
