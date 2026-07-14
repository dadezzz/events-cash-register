import type { RemoteQuery } from "@sveltejs/kit";
import { Serializable } from "#lib/serializable.ts";
import type { ProductData } from "../data.ts";
import type { ProductId } from "../id.ts";
import type { ProductOption } from "../option/client.ts";
import * as remote from "./index.remote.ts";

export class ProductClient extends Serializable<ProductData> {
  static fromId(id: ProductId): RemoteQuery<ProductClient> {
    return remote.fromId(id);
  }

  getOptions(): RemoteQuery<ProductOption[]> {
    return remote.getOptions(this.data.id);
  }
}
