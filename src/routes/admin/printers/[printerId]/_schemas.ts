import { jobCreationAttributeSchema } from "@workspace/cups/utils";
import * as v from "valibot";
import { PrinterClient } from "#lib/entities/printer/client/index.ts";
import { printerIdSchema } from "#lib/entities/printer/id.ts";

export const updateSettingsFormSchema = v.lazyAsync(async (input) => {
  const { printerId } = v.parse(v.object({ printerId: printerIdSchema }), input);

  const printer = await PrinterClient.fromId(printerId);
  const settings = await printer.getSettingsAvailable();

  return v.object({
    printerId: printerIdSchema,
    settings: v.array(
      v.variant(
        "name",
        settings.map((se) =>
          v.object({
            name: v.literal(se.name),
            sValue: jobCreationAttributeSchema(se),
          }),
        ),
      ),
    ),
  });
});

export const deletePrinterFormSchema = v.object({
  id: printerIdSchema,
});
