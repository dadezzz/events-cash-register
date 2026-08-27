import type { UUID } from "node:crypto";
import * as v from "valibot";

export type PrinterReceiptTemplateId = UUID & { __brand: "PrinterReceiptTemplateId" };

export const printerReceiptTemplateIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as PrinterReceiptTemplateId),
);
