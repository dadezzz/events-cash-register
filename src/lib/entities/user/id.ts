import type { UUID } from "node:crypto";
import * as v from "valibot";

export type UserId = UUID & { __brand: "UserId" };

export const userIdSchema = v.pipe(
  v.string(),
  v.uuid(),
  v.transform((i) => i as UserId),
);

export type UserPrivilege = "ADMIN";
