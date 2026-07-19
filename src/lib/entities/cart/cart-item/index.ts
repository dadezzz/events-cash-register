import { createHash } from "node:crypto";
import type { ProductId } from "#lib/entities/products/id.ts";
import type { ProductOptionId } from "#lib/entities/products/option/id.ts";
import type { ProductOptionValue } from "#lib/entities/products/option/index.ts";
import type { CartItemId } from "./id.ts";

export type CartItemValue = { optionId: ProductOptionId; price: number | null; value: ProductOptionValue };

export class CartItem {
  readonly id: CartItemId;

  constructor(id: CartItemId) {
    this.id = id;
  }

  static hash(productId: ProductId, values: { optionId: ProductOptionId; value: ProductOptionValue }[]) {
    const hash = createHash("sha256");
    const sortedValues = values.toSorted((a, b) => (a.optionId < b.optionId ? -1 : 1));
    hash.update(`${productId};${sortedValues.map((v) => `${v.optionId}:${v.value}`).join(";")}`);
    return hash.digest("base64");
  }
}
