import { redirect as svelteKitRedirect } from "@sveltejs/kit";
import * as v from "valibot";

/** For now it validates that the parameter is a path (and not very strictly). */
const redirectParamSchema = v.pipe(v.string(), v.startsWith("/"));

/**
 * Validates that the route to insert or that we got from the url parameter is
 * valid. In the future additional checks can be added here if we want to support
 * cross-domain redirects.
 */
function validateRedirect(route: string): boolean {
  return v.safeParse(redirectParamSchema, route).success;
}

/**
 * Gets the value of the redirect parameter from the given url.
 *
 * @param url Url of the current page.
 * @returns The route contained in the url redirect parameter.
 */
export function getRedirectParam(url: URL): string {
  const route = url.searchParams.get("redirect");

  if (!route || !validateRedirect(route)) {
    return "/";
  }

  return route;
}

/**
 * Validates the given route and creates a new redirect url parameter.
 *
 * @param route Route to redirect the user to.
 * @returns The new redirect parameter to use.
 */
export function newRedirectParam(route: string | null): string {
  if (!route || !validateRedirect(route)) {
    return `redirect=${encodeURIComponent("/")}`;
  }

  return `redirect=${encodeURIComponent(route)}`;
}

/**
 * Returns a new redirect parameter with the value taken from the one in the url
 * of the current page.
 *
 * @param url Url of the current page.
 * @returns The new redirect parameter to use.
 */
export function copyRedirectParam(url: URL): string {
  return newRedirectParam(getRedirectParam(url));
}

/**
 * Gets the redirect parameter from the request url and redirects the user to
 * the page specified in that parameter.
 *
 * @param url Url where to get the redirect parameter from.
 * @param status Status code to use for the redirect response.
 */
export function redirectFromParam(url: URL, status = 303): never {
  redirect(getRedirectParam(url), status);
}

/**
 * Redirects to the given path after localising it.
 *
 * @param route Route to redirect the user to.
 * @param status Status code to use for the redirect response.
 */
export function redirect(route: string, status = 303): never {
  svelteKitRedirect(status, route);
}
