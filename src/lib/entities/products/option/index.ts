import * as v from "valibot";
import { priceSchema } from "#lib/price.ts";

export const productOptionChoiceMinEntries = 2;

export const productOptionDataColumnSchema = v.variant(
  "type",
  [
    v.object({
      type: v.pipe(v.literal("boolean"), v.description("Booleano (casella a spunta)")),
      price: priceSchema,
    }),
    v.object({
      type: v.pipe(v.literal("choice"), v.description("A scelta (radio)")),
      entries: v.pipe(
        v.array(
          v.object({
            value: v.pipe(v.string(), v.nonEmpty("Input richiesto")),
            price: priceSchema,
          }),
        ),
        v.minLength(productOptionChoiceMinEntries, "Le opzioni devono essere almeno 2"),
      ),
    }),
  ],
  "Scegliere una tipologia di opzione",
);

export type ProductOptionDataColumn = v.InferOutput<typeof productOptionDataColumnSchema>;

export const productOptionBooleanValueSchema = v.boolean();

export function productOptionChoiceValueSchema(values: string[]) {
  return v.picklist(values);
}

export type ProductOptionValue =
  | v.InferOutput<typeof productOptionBooleanValueSchema>
  | v.InferOutput<ReturnType<typeof productOptionChoiceValueSchema>>;
