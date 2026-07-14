import * as v from "valibot";
import { Serializable } from "#lib/serializable.ts";
import type { ProductOptionData } from "./data.ts";
import { type ProductOptionValue, productOptionBooleanValueSchema, productOptionChoiceValueSchema } from "./index.ts";

export class ProductOptionClient extends Serializable<ProductOptionData> {
  getPrice(value: ProductOptionValue): number | null {
    switch (this.data.data.type) {
      case "boolean": {
        const parsed = v.safeParse(productOptionBooleanValueSchema, value);
        if (!parsed.success) {
          return null;
        }

        return parsed.output ? this.data.data.price : 0;
      }

      case "choice": {
        const values = this.data.data.entries.map((e) => e.value);
        const parsed = v.safeParse(productOptionChoiceValueSchema(values), value);

        if (!parsed.success) {
          return null;
        }

        return this.data.data.entries.find((e) => e.value === parsed.output)?.price ?? null;
      }
    }
  }
}
