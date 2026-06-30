import { randomUUID } from "node:crypto";
import { blob, index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { ProductId } from "#lib/entities/products/id.ts";
import type { ProductOptionId } from "#lib/entities/products/option/id.ts";
import type { ProductOptionDBData } from "#lib/entities/products/option/index.ts";
import { timestamp } from "./_utils.ts";
import product from "./product.ts";

const columns = {
  id: text()
    .$type<ProductOptionId>()
    .primaryKey()
    .$default(() => randomUUID() as ProductOptionId),

  productId: text()
    .$type<ProductId>()
    .notNull()
    .references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" }),

  name: text().notNull(),
  data: blob().$type<ProductOptionDBData>().notNull(),
  deletedAt: timestamp(),

  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
};

export default sqliteTable("productOption", columns, (t) => [index("productOption_productId").on(t.productId)]);
