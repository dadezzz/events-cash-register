import type { Duration } from "#lib/duration.ts";
import { dev } from "$app/env";
import { getRequestEvent } from "$app/server";

/**
 * Default cookie options applied to all cookies set by this module.
 *
 * - `path: "/"` — Available across the entire site.
 * - `secure: !dev` — HTTPS-only in production; relaxed in development since
 *   HTTPS is not always available locally.
 * - `sameSite: "lax"` — Protects against CSRF while allowing top-level GET
 *   navigations.
 * - `httpOnly: true` — Prevents client-side JavaScript from accessing the
 *   cookie, mitigating XSS-based theft.
 */
const safetyOptions = {
  path: "/" as const,
  secure: !dev,
  sameSite: "lax" as const,
  httpOnly: true as const,
};

/**
 * Sets a cookie with secure defaults.
 *
 * @param name Name of the cookie to set.
 * @param value Value of the cookie to set.
 * @param maxAge Max age (as a {@link Duration}) for the cookie.
 */
export function setCookie(name: string, value: string, maxAge?: Duration): void {
  getRequestEvent().cookies.set(name, value, {
    ...safetyOptions,
    maxAge: maxAge?.asSeconds(),
  });
}

/**
 * Deletes a cookie with secure defaults.
 *
 * @param name Name of the cookie to delete.
 */
export function deleteCookie(name: string): void {
  getRequestEvent().cookies.delete(name, safetyOptions);
}

/**
 * Reads a cookie value from the current request.
 *
 * @param name Name of the cookie to read.
 * @returns The cookie value, or `null` if the cookie does not exist.
 */
export function getCookie(name: string): string | null {
  return getRequestEvent().cookies.get(name) ?? null;
}
