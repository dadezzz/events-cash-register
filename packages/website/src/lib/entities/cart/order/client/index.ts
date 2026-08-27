import type { RemoteQuery } from "@sveltejs/kit";
import { Serializable } from "#lib/serializable.ts";
import type { OrderData } from "../data.ts";
import type { OrderPaginationOptions } from "../pagination.ts";
import * as remote from "./index.remote.ts";

export class OrderClient extends Serializable<OrderData> {
  static fromPagination(options: OrderPaginationOptions): RemoteQuery<OrderClient[]> {
    return remote.fromPagination(options);
  }

  static countAll(): RemoteQuery<number> {
    return remote.countAll();
  }
}
