import type { Transport } from "@sveltejs/kit";
import { User } from "#lib/entities/user/client/index.ts";

export const transport: Transport = {
  User: {
    decode: (v) => User.deserialize(v),
    encode: (v) => v instanceof User && v.serialize(),
  },
};
