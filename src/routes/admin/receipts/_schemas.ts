import * as v from "valibot";
import { printerIdSchema } from "#lib/entities/printer/id.ts";
import { rootBlockSchema } from "#lib/entities/printer/receipt-template/schema.ts";

export const createReceiptSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  printerId: printerIdSchema,

  blocks: rootBlockSchema,
});
