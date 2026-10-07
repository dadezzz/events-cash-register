import * as v from "valibot";
import { printerIdSchema } from "#lib/entities/printer/id.ts";

export const deletePrinterFormSchema = v.object({
  id: printerIdSchema,
});
