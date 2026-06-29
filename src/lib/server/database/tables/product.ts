import { randomUUID } from "node:crypto";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { ProductId } from "#lib/entities/products/utils.ts";
import { boolean, timestamp } from "./utils.ts";

export default sqliteTable("product", {
  id: text()
    .$type<ProductId>()
    .primaryKey()
    .$default(() => randomUUID() as ProductId),

  name: text().notNull().unique(),
  price: int().notNull(),
  available: boolean().notNull(),
  deleted: boolean()
    .notNull()
    .$default(() => false),

  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
});
