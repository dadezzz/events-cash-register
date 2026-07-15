import type { Transport } from "@sveltejs/kit";
import { CartItemClient } from "#lib/entities/cart/cart-item/client/index.ts";
import { CartClient } from "#lib/entities/cart/client/index.ts";
import { PrinterClient } from "#lib/entities/printer/client/index.ts";
import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
import { ProductClient } from "#lib/entities/products/client/index.ts";
import { ProductOptionClient } from "#lib/entities/products/option/client.ts";
import { UserClient } from "#lib/entities/user/client/index.ts";

export const transport: Transport = {
  UserClient: {
    decode: (v) => UserClient.deserialize(v),
    encode: (v) => v instanceof UserClient && v.serialize(),
  },
  ProductClient: {
    decode: (v) => ProductClient.deserialize(v),
    encode: (v) => v instanceof ProductClient && v.serialize(),
  },
  ProductOptionClient: {
    decode: (v) => ProductOptionClient.deserialize(v),
    encode: (v) => v instanceof ProductOptionClient && v.serialize(),
  },
  ProductCategoryClient: {
    decode: (v) => ProductCategoryClient.deserialize(v),
    encode: (v) => v instanceof ProductCategoryClient && v.serialize(),
  },
  PrinterClient: {
    decode: (v) => PrinterClient.deserialize(v),
    encode: (v) => v instanceof PrinterClient && v.serialize(),
  },
  CartClient: {
    decode: (v) => CartClient.deserialize(v),
    encode: (v) => v instanceof CartClient && v.serialize(),
  },
  CartItemClient: {
    decode: (v) => CartItemClient.deserialize(v),
    encode: (v) => v instanceof CartItemClient && v.serialize(),
  },
};
