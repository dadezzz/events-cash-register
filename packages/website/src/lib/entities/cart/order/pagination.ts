import { type PaginationOptions, paginationSchemaFactory } from "#lib/pagination.ts";
import type { s } from "#lib/server/database/index.ts";

export const orderPaginationSortColumns: (keyof typeof s.order._.columns)[] = ["createdAt", "counter", "finalPrice"];
export type OrderPaginationSortColumn = (typeof orderPaginationSortColumns)[number];

export const orderPaginationSchema = paginationSchemaFactory(orderPaginationSortColumns);

export type OrderPaginationOptions = PaginationOptions<OrderPaginationSortColumn>;
