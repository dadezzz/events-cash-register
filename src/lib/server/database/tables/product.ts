import { randomUUID } from "node:crypto";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { ProductCategoryId } from "#lib/entities/products/category/id.ts";
import type { ProductId } from "#lib/entities/products/id.ts";
import { boolean, timestamp } from "./_utils.ts";
import productCategory from "./productCategory.ts";

const columns = {
  id: text()
    .$type<ProductId>()
    .primaryKey()
    .$default(() => randomUUID() as ProductId),

  categoryId: text()
    .$type<ProductCategoryId>()
    .notNull()
    .references(() => productCategory.id, { onDelete: "cascade", onUpdate: "cascade" }),

  name: text().notNull(),
  price: int().notNull(),
  available: boolean().notNull(),

  deletedAt: timestamp(),
  createdAt: timestamp()
    .notNull()
    .$default(() => new Date()),
};

export default sqliteTable("product", columns, (t) => [index("product_categoryId").on(t.categoryId)]);
