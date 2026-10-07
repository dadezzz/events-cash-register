import * as v from "valibot";
import { printerIdSchema } from "#lib/entities/printer/id.ts";

export const addReceiptFormSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  printerId: printerIdSchema,
});
