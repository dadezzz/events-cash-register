import type { Transport } from "@sveltejs/kit";
import { Duration } from "#lib/duration.ts";
import { CartItemClient } from "#lib/entities/cart/cart-item/client/index.ts";
import { CartClient } from "#lib/entities/cart/client/index.ts";
import { OrderClient } from "#lib/entities/cart/order/client/index.ts";
import { PrinterClient } from "#lib/entities/printer/client/index.ts";
import { PrinterReceiptTemplateClient } from "#lib/entities/printer/receipt-template/client.ts";
import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
import { ProductClient } from "#lib/entities/products/client/index.ts";
import { ProductOptionClient } from "#lib/entities/products/option/client/index.ts";
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
  PrinterReceiptTemplateClient: {
    decode: (v) => PrinterReceiptTemplateClient.deserialize(v),
    encode: (v) => v instanceof PrinterReceiptTemplateClient && v.serialize(),
  },
  CartClient: {
    decode: (v) => CartClient.deserialize(v),
    encode: (v) => v instanceof CartClient && v.serialize(),
  },
  CartItemClient: {
    decode: (v) => CartItemClient.deserialize(v),
    encode: (v) => v instanceof CartItemClient && v.serialize(),
  },
  OrderClient: {
    decode: (v) => OrderClient.deserialize(v),
    encode: (v) => v instanceof OrderClient && v.serialize(),
  },
  Duration: {
    decode: (v) => Duration.fromMilliseconds(v),
    encode: (v) => v instanceof Duration && v.asMilliseconds(),
  },
};
