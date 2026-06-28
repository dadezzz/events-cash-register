import { createHash } from "node:crypto";
import { getRequestEvent } from "$app/server";

/** Value of an header of the current request. */
export function getRequestHeader(name: string): string | null {
  return getRequestEvent().request.headers.get(name);
}

/** Value of an header of the current request, converted to int. */
export function getRequestHeaderInt(name: string): number | null {
  const str = getRequestEvent().request.headers.get(name);
  if (!str) return null;

  try {
    return Number.parseInt(str, 10);
  } catch {
    return null;
  }
}

/** Initial IP of the client (the one most close to them). */
export function getRequestClientIp(): string {
  return getRequestEvent().getClientAddress();
}

/**
 * Generates an hash of the 'id + request headers' values. This hash can be used
 * to fix a session id to a specific client, preventing users from guessing
 * random ids.
 *
 * @param secret Id of the client, can be included in the hash to add another element
 * of uniqueness.
 *
 * @returns The hash that identifies the current client browser.
 */
export function getRequestHeadersHash(secret: string, headers: string[]): string {
  const hash = createHash("sha256");
  hash.update(secret);

  for (const h of headers) {
    // Avoid using full header if value is too long.
    hash.update(getRequestHeader(h)?.substring(0, 500) ?? "");
  }

  return hash.digest("base64");
}
