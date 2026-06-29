import { randomUUID } from "node:crypto";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { ProductId } from "#lib/entities/products/id.ts";
import { boolean, timestamp } from "./utils.ts";

export default sqliteTable("product", {
  id: text()
    .$type<ProductId>()
    .primaryKey()
    .$default(() => randomUUID() as ProductId),

  name: text().notNull(),
  price: int().notNull(),
  available: boolean().notNull(),

  deletedAt: timestamp(),
  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
});
