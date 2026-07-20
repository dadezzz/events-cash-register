import { type PaginationOptions, paginationSchemaFactory } from "#lib/pagination.ts";
import type { s } from "#lib/server/database/index.ts";

export const userPaginationSortColumns: (keyof typeof s.user._.columns)[] = ["createdAt", "name", "username"];
export type UserPaginationSortColumn = (typeof userPaginationSortColumns)[number];

export const userPaginationSchema = paginationSchemaFactory(userPaginationSortColumns);

export type UserPaginationOptions = PaginationOptions<UserPaginationSortColumn>;
