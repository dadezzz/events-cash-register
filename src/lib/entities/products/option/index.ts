import type * as v from "valibot";
import type { productOptionBooleanValueSchema, productOptionChoiceValueSchema } from "./schema.ts";

export type ProductOptionDBData =
  | { type: "boolean"; price: number }
  | { type: "choice"; entries: { value: string; price: number }[] };

export type ProductOptionValue =
  | v.InferOutput<typeof productOptionBooleanValueSchema>
  | v.InferOutput<ReturnType<typeof productOptionChoiceValueSchema>>;
