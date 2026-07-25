import * as v from "valibot";
import { cartItemIdSchema } from "#lib/entities/cart/cart-item/id.ts";
import { pricePositiveSchema } from "#lib/price.ts";

export const deleteCartItemFormSchema = v.object({
  id: cartItemIdSchema,
});

export const createOrderFormSchema = v.object({
  finalPrice: pricePositiveSchema,
});
