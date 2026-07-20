import { eq, sql } from "drizzle-orm";
import puppeteer from "puppeteer-core";
import { getFirstOrThrow } from "#lib/array.ts";
import { CartItem } from "#lib/entities/cart/cart-item/index.ts";
import { PrinterReceiptTemplateBatch } from "#lib/entities/printer/receipt-template/batch.ts";
import { renderReceiptHtml } from "#lib/entities/printer/receipt-template/render.ts";
import { ProductBatch } from "#lib/entities/products/batch.ts";
import { priceToString } from "#lib/price.ts";
import { db, s } from "#lib/server/database/index.ts";
import { PUPPETEER_EXECUTABLE_PATH } from "$app/env/private";
import type { CartId } from "../id.ts";
import type { Cart } from "../index.ts";

const browser = await puppeteer.launch({
  executablePath: PUPPETEER_EXECUTABLE_PATH,
  args: ["--no-sandbox"],
});

const COUNTER_EVENT = "default";

export class Order {
  cartId: CartId;

  constructor(cartId: CartId) {
    this.cartId = cartId;
  }

  static async create(cart: Cart, finalPrice: number): Promise<Order | null> {
    const cartItemsBatch = await cart.getItems();
    const cartItemValues = await cartItemsBatch.getValues();
    const cartItemProducts = await cartItemsBatch.getProducts();
    const productsBatch = new ProductBatch(
      cartItemProducts
        .values()
        .map((p) => p.id)
        .toArray(),
    );
    const productPrices = await productsBatch.getPrices();
    const productClients = await productsBatch.getClients();
    const productOptionsBatch = await productsBatch.getOptions();
    const productOptionClients = await productOptionsBatch.getClients();

    let totalPrice = 0;
    for (const cartItemId of cartItemsBatch.ids) {
      const values = cartItemValues.get(cartItemId) ?? [];
      const productId = cartItemProducts.get(cartItemId)?.id;
      const productPrice = productId ? productPrices.get(productId) : null;

      if (values.some((v) => v.price === null) || productPrice === null) {
        return null;
      }

      // Invalid values are filtered above.
      totalPrice += productPrice + values.map((v) => v.price as number).reduce((a, b) => a + b, 0);
    }

    if (!totalPrice || totalPrice <= 0) {
      return null;
    }

    const counterRow = await db
      .update(s.orderCounter)
      .set({ value: sql`${s.orderCounter.value} + 1` })
      .returning({ value: s.orderCounter.value })
      .where(eq(s.orderCounter.event, COUNTER_EVENT))
      .then(getFirstOrThrow);

    const createdAt = new Date();
    await db.insert(s.order).values({ cartId: cart.id, counter: counterRow.value, finalPrice, createdAt });

    const receiptTemplates = await PrinterReceiptTemplateBatch.getAll();
    const receiptPrintingInfo = await receiptTemplates.getPrintingInfo();

    for (const i of receiptPrintingInfo.values()) {
      const page = await browser.newPage();

      const quantityCounters = new Map<string, number>();
      page.setContent(
        renderReceiptHtml(i.template, {
          date: createdAt.toDateString(),
          time: createdAt.toTimeString(),
          order: {
            counter: counterRow.toString(),
            discountPrice: priceToString(finalPrice - totalPrice),
            modifiedPrice: priceToString(finalPrice),
            totalPrice: priceToString(totalPrice),
          },
          products: cartItemsBatch.ids
            .map((id) => {
              const product = cartItemProducts.get(id);
              if (!product) {
                return null;
              }

              const productClient = productClients.get(product.id);
              if (!productClient) {
                return null;
              }

              const values = cartItemValues.get(id) ?? [];

              return {
                name: productClient.data.name,
                hash: CartItem.hash(productClient.data.id, values),
                price: priceToString(productClient.data.price),
                options: values
                  .map((v) => {
                    const optionClient = productOptionClients.get(v.optionId);
                    if (!optionClient || v.price === null) {
                      return null;
                    }

                    let valueStr: string;
                    switch (optionClient.data.data.type) {
                      case "boolean":
                        if (!(v.value as boolean)) {
                          return null;
                        }

                        valueStr = "Sì";
                        break;
                      case "choice":
                        valueStr = v.value as string;
                        break;
                    }

                    return {
                      name: optionClient.data.name,
                      value: valueStr,
                      price: priceToString(v.price),
                    };
                  })
                  .filter((v) => v !== null),
              };
            })
            .filter((p) => p !== null)
            .map(({ hash, ...p }) => {
              const quantity = quantityCounters.getOrInsert(hash, 0) + 1;
              quantityCounters.set(hash, quantity);
              return { ...p, quantity: quantity.toString() };
            }),
        }),
      );

      const pdf = await page.pdf();
      await i.printer.print(i.name, pdf);
      await page.close();
    }

    return new Order(cart.id);
  }

  static async countAll(): Promise<number> {
    return await db.$count(s.order);
  }

  static async resetCounter(): Promise<void> {
    await db.update(s.orderCounter).set({ value: 0 }).where(eq(s.orderCounter.event, COUNTER_EVENT));
  }
}

export async function initOrderState() {
  await db.insert(s.orderCounter).values({ event: COUNTER_EVENT }).onConflictDoNothing();
}
