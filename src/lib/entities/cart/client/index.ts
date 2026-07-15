import type { RemoteQuery } from "@sveltejs/kit";
import { Serializable } from "#lib/serializable.ts";
import type { CartItemClient } from "../cart-item/client/index.ts";
import type { CartId } from "../id.ts";
import * as remote from "./index.remote.ts";

export interface CartClientData {
  id: CartId;
}

export class CartClient extends Serializable<CartClientData> {
  static getUserLatest(): RemoteQuery<CartClient> {
    return remote.getUserLatest();
  }

  static fromId(id: CartId): RemoteQuery<CartClient> {
    return remote.fromId(id);
  }

  getItems(): RemoteQuery<CartItemClient[]> {
    return remote.getItems(this.data.id);
  }
}
