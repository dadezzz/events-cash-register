import type { RemoteQuery } from "@sveltejs/kit";
import type { ProductClient } from "#lib/entities/products/client/index.ts";
import type { ProductId } from "#lib/entities/products/id.ts";
import { Serializable } from "#lib/serializable.ts";
import type { CartItemId } from "../id.ts";
import type { CartItemValue } from "../index.ts";
import * as remote from "./index.remote.ts";

export interface CartItemClientData {
  id: CartItemId;
  productId: ProductId;
}

export class CartItemClient extends Serializable<CartItemClientData> {
  getProduct(): RemoteQuery<ProductClient> {
    return remote.getProduct(this.data.id);
  }

  getValues(): RemoteQuery<CartItemValue[]> {
    return remote.getValues(this.data.id);
  }
}
