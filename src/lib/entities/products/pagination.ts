import { paginationSchemaFactory } from "#lib/pagination.ts";

export const paginationSortColumns = ["name", "createdAt", "price", "available"] as const;
export type PaginationSortColumn = (typeof paginationSortColumns)[number];

export const paginationSchema = paginationSchemaFactory(paginationSortColumns);
