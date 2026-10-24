import * as v from "valibot";
import { priceSchema } from "#lib/price.ts";

export const productOptionChoiceMinEntries = 2;

export const productOptionDataColumnSchema = v.variant("type", [
  v.object({
    price: priceSchema,
    type: v.pipe(v.literal("boolean"), v.description("Booleano (casella a spunta)")),
  }),
  v.object({
    entries: v.pipe(
      v.optional(
        v.array(
          v.object({
            price: priceSchema,
            value: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
          }),
        ),
        [],
      ),
      v.minLength(productOptionChoiceMinEntries, "Le opzioni devono essere almeno 2"),
    ),
    type: v.pipe(v.literal("choice"), v.description("A scelta (radio)")),
  }),
]);

export type ProductOptionDataColumn = v.InferOutput<typeof productOptionDataColumnSchema>;

export type ProductOptionValue = boolean | string;

export function calculateProductOptionPrice(data: ProductOptionDataColumn, value: ProductOptionValue): number | null {
  switch (data.type) {
    case "boolean": {
      const parsed = v.safeParse(v.boolean(), value);
      if (!parsed.success) {
        return null;
      }

      return parsed.output ? data.price : 0;
    }

    case "choice": {
      const parsed = v.safeParse(v.string(), value);
      if (!parsed.success) {
        return null;
      }

      return data.entries.find((e) => e.value === parsed.output)?.price ?? null;
    }
  }
}
