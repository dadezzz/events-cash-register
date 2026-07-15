import * as v from "valibot";
import { Serializable } from "#lib/serializable.ts";
import type { ProductOptionData } from "./data.ts";
import type { ProductOptionValue } from "./index.ts";

export class ProductOptionClient extends Serializable<ProductOptionData> {
  getSchema(): v.GenericSchema<ProductOptionValue | undefined, ProductOptionValue> {
    switch (this.data.data.type) {
      case "boolean":
        return v.optional(v.boolean(), false);
      case "choice":
        return v.pipe(v.string(), v.picklist(this.data.data.entries.map((e) => e.value)));
    }
  }

  getPrice(value: ProductOptionValue): number | null {
    switch (this.data.data.type) {
      case "boolean": {
        const parsed = v.safeParse(v.boolean(), value);
        if (!parsed.success) {
          return null;
        }

        return parsed.output ? this.data.data.price : 0;
      }

      case "choice": {
        const parsed = v.safeParse(v.string(), value);
        if (!parsed.success) {
          return null;
        }

        return this.data.data.entries.find((e) => e.value === parsed.output)?.price ?? null;
      }
    }
  }
}
