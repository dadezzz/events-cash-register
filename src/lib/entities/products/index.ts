import { and, eq } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import { db, s } from "#lib/server/database/index.ts";
import type { ProductData } from "./data.ts";
import type { ProductId } from "./id.ts";
import type { ProductOptionId } from "./option/id.ts";
import type { ProductOptionDataColumn } from "./option/index.ts";

export class Product {
  id: ProductId;

  constructor(id: ProductId) {
    this.id = id;
  }

  static async fromId(id: ProductId): Promise<Product | null> {
    const product = await db
      .select({ id: s.product.id })
      .from(s.product)
      .where(eq(s.product.id, id))
      .then(getFirstOptional);
    return product ? new Product(product.id) : null;
  }

  static async create(data: Omit<ProductData, "id" | "createdAt" | "deletedAt">): Promise<Product> {
    const product = await db.insert(s.product).values(data).returning({ id: s.product.id }).then(getFirstOrThrow);
    return new Product(product.id);
  }

  async update(data: Omit<ProductData, "createdAt" | "id" | "deletedAt">): Promise<void> {
    await db.update(s.product).set(data).where(eq(s.product.id, this.id));
  }

  async delete(): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.update(s.productOption).set({ deletedAt: new Date() }).where(eq(s.productOption.productId, this.id));
      await tx.update(s.product).set({ deletedAt: new Date() }).where(eq(s.product.id, this.id));
    });
  }

  async addOption(name: string, data: ProductOptionDataColumn): Promise<void> {
    await db.insert(s.productOption).values({ productId: this.id, name, data });
  }

  async deleteOption(id: ProductOptionId): Promise<void> {
    await db
      .update(s.productOption)
      .set({ deletedAt: new Date() })
      .where(and(eq(s.productOption.productId, this.id), eq(s.productOption.id, id)));
  }
}
