import type { ProductId } from "#lib/entities/products/id.ts";
import { Serializable } from "#lib/serializable.ts";
import type { CartItemId } from "../id.ts";
import * as remote from "./index.remote.ts";

export interface CartItemClientData {
  id: CartItemId;
  productId: ProductId;
}

export class CartItemClient extends Serializable<CartItemClientData> {
  getProduct() {
    return remote.getProduct(this.data.id);
  }
}
