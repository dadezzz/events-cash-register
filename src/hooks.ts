import type { Transport } from "@sveltejs/kit";
import { PrinterClient } from "#lib/entities/printer/client/index.ts";
import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
import { ProductClient } from "#lib/entities/products/client/index.ts";
import { ProductOption } from "#lib/entities/products/option/client.ts";
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
  ProductOption: {
    decode: (v) => ProductOption.deserialize(v),
    encode: (v) => v instanceof ProductOption && v.serialize(),
  },
  ProductCategoryClient: {
    decode: (v) => ProductCategoryClient.deserialize(v),
    encode: (v) => v instanceof ProductCategoryClient && v.serialize(),
  },
  Printer: {
    decode: (v) => PrinterClient.deserialize(v),
    encode: (v) => v instanceof PrinterClient && v.serialize(),
  },
};
