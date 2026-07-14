import type { RemoteQuery } from "@sveltejs/kit";
import { Serializable } from "#lib/serializable.ts";
import type { ProductClient } from "../../client/index.ts";
import type { ProductCategoryData } from "../data.ts";
import type { ProductCategoryId } from "../id.ts";
import * as remote from "./index.remote.ts";

export class ProductCategoryClient extends Serializable<ProductCategoryData> {
  static fromId(id: ProductCategoryId): RemoteQuery<ProductCategoryClient> {
    return remote.fromId(id);
  }

  static getAll(): RemoteQuery<ProductCategoryClient[]> {
    return remote.getAll();
  }

  countProducts(): RemoteQuery<number> {
    return remote.countProducts(this.data.id);
  }

  getProducts(): RemoteQuery<ProductClient[]> {
    return remote.getProducts(this.data.id);
  }
}
