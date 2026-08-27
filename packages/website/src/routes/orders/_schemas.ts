import * as v from "valibot";
import { cartIdSchema } from "#lib/entities/cart/id.ts";

export const deleteOrderFormSchema = v.object({
  cartId: cartIdSchema,
});
