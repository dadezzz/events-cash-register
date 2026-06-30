import type { Transport } from "@sveltejs/kit";
import { Product } from "#lib/entities/products/client/index.ts";
import { ProductOption } from "#lib/entities/products/option/client.ts";
import { User } from "#lib/entities/user/client/index.ts";

export const transport: Transport = {
  User: {
    decode: (v) => User.deserialize(v),
    encode: (v) => v instanceof User && v.serialize(),
  },
  Product: {
    decode: (v) => Product.deserialize(v),
    encode: (v) => v instanceof Product && v.serialize(),
  },
  ProductOption: {
    decode: (v) => ProductOption.deserialize(v),
    encode: (v) => v instanceof ProductOption && v.serialize(),
  },
};
