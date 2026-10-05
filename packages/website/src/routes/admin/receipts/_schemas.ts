import * as v from "valibot";
import { printerIdSchema } from "#lib/entities/printer/id.ts";
import { printerReceiptTemplateIdSchema } from "#lib/entities/printer/receipt-template/id.ts";
import { rootBlockSchema } from "#lib/entities/printer/receipt-template/schema.ts";

export const addReceiptFormSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  printerId: printerIdSchema,
});

export const updateBlocksFormSchema = v.object({
  id: printerReceiptTemplateIdSchema,
  blocks: rootBlockSchema,
});

export const updateOptionsFormSchema = v.object({
  id: printerReceiptTemplateIdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  printerId: printerIdSchema,
});
