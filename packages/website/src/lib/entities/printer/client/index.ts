import type { RemoteQuery } from "@sveltejs/kit";
import type { JobCreationAttributesAvailable, JobCreationAttributesSelected } from "@workspace/cups/utils";
import { Serializable } from "#lib/serializable.ts";
import type { PrinterData } from "../data.ts";
import type { PrinterId } from "../id.ts";
import type { PrinterReceiptTemplateClient } from "../receipt-template/client.ts";
import * as remote from "./index.remote.ts";

type PrinterDataClient = PrinterData & { available: boolean };

export class PrinterClient extends Serializable<PrinterDataClient> {
  static getAll(): RemoteQuery<PrinterClient[]> {
    return remote.getAll();
  }

  static fromId(id: PrinterId): RemoteQuery<PrinterClient> {
    return remote.fromId(id);
  }

  getSettingsAvailable(): RemoteQuery<JobCreationAttributesAvailable> {
    return remote.getSettingsAvailable(this.data.id);
  }

  getSettingsSelected(): RemoteQuery<JobCreationAttributesSelected> {
    return remote.getSettingsSelected(this.data.id);
  }

  getReceiptTemplates(): RemoteQuery<PrinterReceiptTemplateClient[]> {
    return remote.getReceiptTemplates(this.data.id);
  }
}
