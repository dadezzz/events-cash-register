import {
  type Argon2Algorithm,
  type Argon2Parameters,
  argon2 as argon2CB,
  randomBytes as randomBytesCB,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import * as v from "valibot";

const randomBytes = promisify(randomBytesCB);
const argon2 = promisify(argon2CB);

// Node internally uses argon2id v1.3. Hardcoded since there's no parameter that
// exposes it.
const VERSION = 0x13;

interface Argon2Type {
  algorithm: Argon2Algorithm;
  version: number;
}

interface Argon2Cost {
  parallelism: number;
  memory: number;
  passes: number;
}

function createArgon2CostString(params: Argon2Cost): string {
  return [`m=${params.memory}`, `t=${params.passes}`, `p=${params.parallelism}`].join(",");
}

const argon2CostShortSchema = v.object({
  m: v.pipe(v.string(), v.nonEmpty(), v.digits(), v.toNumber()),
  p: v.pipe(v.string(), v.nonEmpty(), v.digits(), v.toNumber()),
  t: v.pipe(v.string(), v.nonEmpty(), v.digits(), v.toNumber()),
});

function parseArgon2CostString(str: string): Argon2Cost {
  const obj = Object.fromEntries(str.split(",").map((e) => e.split("=", 2)));
  const objValid = v.parse(argon2CostShortSchema, obj);
  return {
    memory: objValid.m,
    parallelism: objValid.p,
    passes: objValid.t,
  };
}

interface PHCStringParts extends Argon2Type, Argon2Cost {
  hash: Buffer;
  salt: Buffer;
}

// Reference: https://c2sp.org/phc-strings
export type PHCString = string & { __brand: "PHCString" };

function createPHCString(parts: PHCStringParts): PHCString {
  return [
    `$${parts.algorithm}`,
    `v=${parts.version}`,
    createArgon2CostString(parts),
    parts.salt.toBase64(),
    parts.hash.toBase64(),
  ].join("$") as PHCString;
}

const argon2PHCSchema = v.tuple([
  v.pipe(
    v.string(),
    v.transform((i) => i.replace(/^\$/, "")),
    v.picklist(["argon2id", "argon2i", "argon2d"]),
  ),
  v.pipe(
    v.string(),
    v.transform((i) => i.replace(/^v=/, "")),
    v.nonEmpty(),
    v.digits(),
    v.transform((i) => Number(i)),
    v.literal(VERSION), // Only one version is supported for now.
  ),
  v.pipe(v.string(), v.transform(parseArgon2CostString)),
  v.pipe(
    v.string(),
    v.nonEmpty(),
    v.transform((i) => Buffer.from(i, "base64")),
  ),
  v.pipe(
    v.string(),
    v.nonEmpty(),
    v.transform((i) => Buffer.from(i, "base64")),
  ),
]);

function parsePHCString(phcString: PHCString): PHCStringParts {
  // Slice to remove the first '' given by the starting $.
  const splits = phcString.split("$").slice(1, undefined);
  const splitsValid = v.parse(argon2PHCSchema, splits);
  const [algorithm, version, cost, salt, hash] = splitsValid;
  return { ...cost, algorithm, hash, salt, version };
}

export async function hash(password: string): Promise<PHCString> {
  // Limit the length of passwords, to prevent DOS attacks.
  if (password.length > 4 * 1024) {
    throw new Error("password too long");
  }

  const salt = await randomBytes(24);

  const algorithm = "argon2id";
  // TODO: benchmark to see what parameters allow good security in 250-500ms of
  // compute time.
  const params: Argon2Parameters = {
    memory: 65536,
    message: password,
    nonce: salt,
    parallelism: 4,
    passes: 3,
    tagLength: 40,
  };

  const hash = await argon2(algorithm, params);

  return createPHCString({
    algorithm: algorithm,
    hash,
    memory: params.memory,
    parallelism: params.parallelism,
    passes: params.passes,
    salt,
    version: VERSION,
  });
}

export async function verify(phcString: PHCString, password: string): Promise<boolean> {
  const params = parsePHCString(phcString);

  const testHash = await argon2(params.algorithm, {
    memory: params.memory,
    message: password,
    nonce: params.salt,
    parallelism: params.parallelism,
    passes: params.passes,
    tagLength: params.hash.length,
  });

  return timingSafeEqual(testHash, params.hash);
}
