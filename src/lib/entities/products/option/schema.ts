import * as v from "valibot";

export const productOptionBooleanValueSchema = v.boolean();

export function productOptionChoiceValueSchema(values: string[]) {
  return v.picklist(values);
}
