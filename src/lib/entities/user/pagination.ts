import { paginationSchemaFactory } from "#lib/pagination.ts";

export const paginationSortColumns = ["createdAt", "name", "username"] as const;
export type PaginationSortColumn = (typeof paginationSortColumns)[number];

export const paginationSchema = paginationSchemaFactory(paginationSortColumns);
