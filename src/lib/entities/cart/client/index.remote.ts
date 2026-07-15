import { requireUser } from "#lib/auth/index.server.ts";
import { e } from "#lib/error.ts";
import { query } from "$app/server";
import { CartBatch } from "../batch.ts";
import { CartItemBatch } from "../cart-item/batch.ts";
import { cartIdSchema } from "../id.ts";
import { Cart } from "../index.ts";
import { CartClient } from "./index.ts";

export const getUserLatest = query(async () => {
  const user = await requireUser();

  const cart = await Cart.getUserLatestOrCreate(user);

  return new CartClient({ id: cart.id });
});

export const fromId = query.batch(cartIdSchema, async (ids) => {
  const user = await requireUser();

  const batch = await CartBatch.forUser(user, ids);
  const clients = batch.getClients();

  return (id) => clients.get(id) ?? e.error404();
});

export const getItems = query.batch(cartIdSchema, async (ids) => {
  const user = await requireUser();

  const batch = await CartBatch.forUser(user, ids);
  const items = await batch.getItems();
  const itemsBatch = new CartItemBatch(
    items
      .values()
      .flatMap((i) => i.map((ii) => ii.id))
      .toArray(),
  );
  const itemClients = await itemsBatch.getClients();

  return (id) => {
    const itemIds = items.get(id)?.map((i) => i.id) ?? [];
    return itemClients
      .values()
      .filter((c) => itemIds.includes(c.data.id))
      .toArray();
  };
});
