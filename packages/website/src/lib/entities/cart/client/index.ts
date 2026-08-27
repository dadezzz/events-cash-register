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

  async getTotalPrice(): Promise<number | null> {
    const items = await this.getItems();
    const itemPrices = await Promise.all(
      items.map(async (i) => {
        const product = await i.getProduct();
        const values = await i.getValues();

        let sum = product.data.price;
        for (const v of values) {
          if (v.price === null) return null;
          sum += v.price;
        }

        return sum;
      }),
    );

    return itemPrices.reduce((a, b) => {
      if (a === null || b === null) {
        return null;
      }

      return a + b;
    }, 0);
  }
}
