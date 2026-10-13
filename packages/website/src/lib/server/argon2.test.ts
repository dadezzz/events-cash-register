import { expect, test } from "vitest";
import { hash, verify } from "./argon2.ts";

test("matching passwords", async () => {
  const password = "1234";

  const phcString = await hash(password);
  expect(await verify(phcString, password)).toBe(true);
});

test("non matching passwords", async () => {
  const password = "1234";
  const wrongPassword = "4321";

  const phcString = await hash(password);
  expect(await verify(phcString, wrongPassword)).toBe(false);
});
