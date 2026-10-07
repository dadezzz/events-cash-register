import * as v from "valibot";
import { printerReceiptTemplateIdSchema } from "#lib/entities/printer/receipt-template/id.ts";
import { rootBlockSchema } from "#lib/entities/printer/receipt-template/schema.ts";

export const updateBlocksFormSchema = v.object({
  id: printerReceiptTemplateIdSchema,
  blocks: rootBlockSchema,
});
