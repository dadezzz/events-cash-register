import type { RemoteQuery } from "@sveltejs/kit";
import type { PaginationOptions } from "#lib/pagination.ts";
import { Serializable } from "#lib/serializable.ts";
import type { ProductData } from "../data.ts";
import type { PaginationSortColumn } from "../pagination.ts";
import * as remote from "./index.remote.ts";

export class Product extends Serializable<ProductData> {
  static countAll(): RemoteQuery<number> {
    return remote.countAll();
  }

  static getAll(options: PaginationOptions<PaginationSortColumn>): RemoteQuery<Product[]> {
    return remote.getAll(options);
  }
}
