import type { Duration } from "#lib/duration.ts";
import { dev } from "$app/env";
import { getRequestEvent } from "$app/server";

// Secure cookies don't work during development since we can't use the https
// protocol (They would work on localhost but sometimes we need to also test
// with other hosts).
const safetyOptions = {
  path: "/",
  secure: !dev,
  sameSite: "lax" as const,
  httpOnly: true,
};

/**
 * Sets a cookie with secure defaults.
 *
 * @param name Name of the cookie to set.
 * @param value Value of the cookie to set.
 * @param maxAgeMs Max age in milliseconds that the cookie should be kept.
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
