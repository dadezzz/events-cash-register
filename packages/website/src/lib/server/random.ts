import { getRandomValues } from "node:crypto";

/**
 * @returns A multipurpose random string. Useful for session id, password-reset challenge id, ...
 */
export function generateRandomString(): string {
  const bytes = new Uint8Array(30);
  return getRandomValues(bytes).toBase64({ alphabet: "base64url" });
}
