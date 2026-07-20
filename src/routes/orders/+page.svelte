<script lang="ts">
  import Header from "#components/Header.svelte";
  import Pagination from "#components/navigation/Pagination.svelte";
  import { requireUser } from "#lib/auth/index.remote.ts";
  import { OrderClient } from "#lib/entities/cart/order/client/index.ts";
  import { orderPaginationSchema } from "#lib/entities/cart/order/pagination.ts";
  import { getCurrentPaginationOptions } from "#lib/pagination.ts";
  import { page } from "$app/state";

  await requireUser();

  const pageSize = 10;
  const paginationOptions = $derived(getCurrentPaginationOptions(orderPaginationSchema, pageSize, page.url));
  const orders = $derived(await OrderClient.fromPagination(paginationOptions));
  const ordersCount = $derived(await OrderClient.countAll());
</script>

<Header />

{#each orders as order (order.data.cartId)}
  <p>{order.data.counter}</p>
{/each}

<Pagination options={paginationOptions} itemsCount={ordersCount} />
