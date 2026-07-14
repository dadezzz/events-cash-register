import { randomUUID } from "node:crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { ProductCategoryId } from "#lib/entities/products/category/id.ts";
import { timestamp } from "./_utils.ts";

export default sqliteTable("productCategory", {
  id: text()
    .$type<ProductCategoryId>()
    .primaryKey()
    .$default(() => randomUUID() as ProductCategoryId),

  name: text().notNull(),

  deletedAt: timestamp(),
  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
});
