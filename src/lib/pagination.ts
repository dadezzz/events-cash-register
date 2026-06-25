import * as v from "valibot";
import { goto } from "$app/navigation";
import { page } from "$app/state";

// Used in queries throughout the project.
export const pageNumberSchema = v.pipe(v.number(), v.minValue(1));

const PAGE_PARAM_NAME = "p";

/**
 * Changes the url of the old page to the one of the provided one.
 *
 * @param newPage Number of the page to go to, page numbers start from 1.
 */
export async function goToPage(newPage: number) {
  const currentUrl = page.url;
  currentUrl.searchParams.set(PAGE_PARAM_NAME, newPage.toString());
  await goto(currentUrl, { invalidateAll: true });
}

/**
 * @param url Url of the current page.
 * @returns The page indicated by the url or 1 by default.
 */
export function getCurrentPage(url: URL): number {
  try {
    const pageParam = url.searchParams.get(PAGE_PARAM_NAME) ?? "1";
    return Number.parseInt(pageParam, 10);
  } catch {
    return 1;
  }
}
