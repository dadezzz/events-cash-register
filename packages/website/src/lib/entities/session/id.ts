import type { UUID } from "node:crypto";

export type SessionId = UUID & { __brand: "SessionId" };

export type SessionIdHash = string & { __brand: "SessionIdHash" };

export const headersToHash = ["user-agent", "cf-ipcountry"];
