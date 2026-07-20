import * as v from "valibot";

const pageNumberSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
const pageSizeSchema = pageNumberSchema;

/**
 * Creates a Valibot schema for validating pagination query parameters.
 *
 * @typeParam V - The union type of valid sort column values.
 * @param sortColumnValues - A readonly array of valid sort column values.
 * @returns A Valibot object schema with `page`, `sortColumn`, and `sortDirection` fields.
 */
export function paginationSchemaFactory<V extends string>(sortColumnValues: readonly V[]) {
  return v.object({
    page: pageNumberSchema,
    pageSize: pageSizeSchema,
    sortColumn: v.picklist(sortColumnValues),
    sortDirection: v.picklist(["asc", "desc"]),
  });
}

/**
 * The Valibot schema returned by {@link paginationSchemaFactory}.
 *
 * @typeParam V - The union type of valid sort column values.
 */
export type PaginationOptionsSchema<V extends string> = ReturnType<typeof paginationSchemaFactory<V>>;

/**
 * The possible sort direction values: `'asc'` or `'desc'`.
 */
export type PaginationSortDirection = PaginationOptionsSchema<string>["entries"]["sortDirection"]["options"][number];

/**
 * The inferred runtime type of pagination options, extracted from the schema.
 *
 * @typeParam V - The union type of valid sort column values.
 */
export type PaginationOptions<V extends string> = v.InferOutput<PaginationOptionsSchema<V>>;

const PAGE_PARAM_NAME = "p";
const SORT_COLUMN_PARAM_NAME = "sc";
const SORT_DIRECTION_PARAM_NAME = "sd";

/**
 * Creates a new URL with pagination query parameters applied.
 *
 * The following query parameters are used:
 * - `p` – page number
 * - `sc` – sort column
 * - `sd` – sort direction (`asc` or `desc`)
 *
 * Only the properties present in `options` will be set on the new URL. The rest
 * are copied from the current URL.
 *
 * @typeParam V - The union type of valid sort column values.
 * @param currentUrl - The base URL to clone and modify.
 * @param options - Partial pagination options to merge into the URL.
 * @returns A new URL with the specified pagination parameters.
 */
export function createPaginationUrl<V extends string>(currentUrl: URL, options: Partial<PaginationOptions<V>>) {
  const newUrl = new URL(currentUrl);

  if (options.page) {
    newUrl.searchParams.set(PAGE_PARAM_NAME, options.page.toString());
  }

  if (options.sortColumn) {
    newUrl.searchParams.set(SORT_COLUMN_PARAM_NAME, options.sortColumn);
  }

  if (options.sortDirection) {
    newUrl.searchParams.set(SORT_DIRECTION_PARAM_NAME, options.sortDirection);
  }

  return newUrl;
}

/**
 * Extracts and validates pagination options from a URL's query parameters.
 *
 * Falls back to defaults (`page: 1`, first sort column, `"desc"`) when
 * parameters are missing or invalid.
 *
 * @typeParam V - The union type of valid sort column values.
 * @param schema - The pagination schema produced by {@link paginationSchemaFactory}.
 * @param url - The URL to extract pagination parameters from.
 * @returns The validated pagination options.
 */
export function getCurrentPaginationOptions<V extends string>(
  schema: PaginationOptionsSchema<V>,
  pageSize: number,
  url: URL,
): PaginationOptions<V> {
  const options: PaginationOptions<V> = {
    page: 1,
    pageSize,
    sortColumn: schema.entries.sortColumn.options[0],
    sortDirection: "desc",
  };

  const pageParam = url.searchParams.get(PAGE_PARAM_NAME);
  const sortColumnParam = url.searchParams.get(SORT_COLUMN_PARAM_NAME);
  const sortDirectionParam = url.searchParams.get(SORT_DIRECTION_PARAM_NAME);

  // Try to get each value for url search params, if not present or not valid,
  // use the default one.

  try {
    if (pageParam) {
      options.page = v.parse(schema.entries.page, Number(pageParam));
    }
  } catch {}

  try {
    if (sortColumnParam) {
      options.sortColumn = v.parse(schema.entries.sortColumn, sortColumnParam);
    }
  } catch {}

  try {
    if (sortDirectionParam) {
      options.sortDirection = v.parse(schema.entries.sortDirection, sortDirectionParam);
    }
  } catch {}

  return options;
}

/**
 * Returns the opposite sort direction.
 *
 * @param direction - The current sort direction (`"asc"` or `"desc"`).
 * @returns The inverted sort direction.
 */
export function invertSortDirection(direction: PaginationSortDirection): PaginationSortDirection {
  switch (direction) {
    case "asc":
      return "desc";
    case "desc":
      return "asc";
  }
}
