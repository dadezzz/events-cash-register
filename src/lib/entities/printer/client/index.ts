import type { RemoteQuery } from "@sveltejs/kit";
import { Serializable } from "#lib/serializable.ts";
import type { PrinterData } from "../data.ts";
import * as remote from "./index.remote.ts";

type PrinterDataClient = PrinterData & { available: boolean };

export class Printer extends Serializable<PrinterDataClient> {
  static getAll(): RemoteQuery<Printer[]> {
    return remote.getAll();
  }
}
