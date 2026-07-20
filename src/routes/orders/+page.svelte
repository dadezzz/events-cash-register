<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import Header from "#components/Header.svelte";
  import Pagination from "#components/navigation/Pagination.svelte";
  import { requireUser } from "#lib/auth/index.remote.ts";
  import { OrderClient } from "#lib/entities/cart/order/client/index.ts";
  import { orderPaginationSchema } from "#lib/entities/cart/order/pagination.ts";
  import { getCurrentPaginationOptions } from "#lib/pagination.ts";
  import { page } from "$app/state";
  import DeleteOrderDialog from "./_components/DeleteOrderDialog.svelte";

  await requireUser();

  const pageSize = 10;
  const paginationOptions = $derived(getCurrentPaginationOptions(orderPaginationSchema, pageSize, page.url));
  const orders = $derived(await OrderClient.fromPagination(paginationOptions));
  const ordersCount = $derived(await OrderClient.countAll());
</script>

<Header />

<ul>
  {#each orders as order (order.data.cartId)}
    <li>
      {order.data.counter}

      <DeleteOrderDialog {order}>
        {#snippet trigger({ props })}
          <button type="button" {...props}>
            <TrashIcon class="size-4" />
          </button>
        {/snippet}
      </DeleteOrderDialog>
    </li>
  {/each}
</ul>

<Pagination options={paginationOptions} itemsCount={ordersCount} />
