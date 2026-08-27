import type { CupsPrinter } from "@workspace/cups";
import type { PrinterId } from "./id.ts";

export const availablePrinters = new Map<PrinterId, CupsPrinter>();
