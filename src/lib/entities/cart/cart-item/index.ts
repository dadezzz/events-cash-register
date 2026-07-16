import type { ProductOptionId } from "#lib/entities/products/option/id.ts";
import type { ProductOptionValue } from "#lib/entities/products/option/index.ts";
import type { CartItemId } from "./id.ts";

export type CartItemValue = { optionId: ProductOptionId; price: number | null; value: ProductOptionValue };

export class CartItem {
  readonly id: CartItemId;

  constructor(id: CartItemId) {
    this.id = id;
  }
}
