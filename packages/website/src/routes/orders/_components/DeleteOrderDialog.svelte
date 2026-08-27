<script lang="ts">
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import type { OrderClient } from "#lib/entities/cart/order/client/index.ts";
  import DeleteOrderForm from "./DeleteOrderForm.svelte";

  interface Props {
    order: OrderClient;
    trigger: Snippet<[{ props: Record<string, unknown> }]>;
  }

  const { order, trigger }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen} {trigger}>
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inner" transition:fly>
      <DeleteOrderForm
        {order}
        onresult={() => {
          dialogOpen = false;
        }}
        oncancel={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
