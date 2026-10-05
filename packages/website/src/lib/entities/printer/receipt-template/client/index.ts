import { Serializable } from "#lib/serializable.ts";
import type { RemoteQuery } from "$app/server";
import type { PrinterReceiptTemplateData } from "../data.ts";
import type { PrinterReceiptTemplateId } from "../id.ts";
import * as remote from "./index.remote.ts";

export class PrinterReceiptTemplateClient extends Serializable<PrinterReceiptTemplateData> {
  static getAll(): RemoteQuery<PrinterReceiptTemplateClient[]> {
    return remote.getAll();
  }

  static fromId(id: PrinterReceiptTemplateId): RemoteQuery<PrinterReceiptTemplateClient> {
    return remote.fromId(id);
  }
}
