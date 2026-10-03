<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import { slide } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
  import { FormatPrice } from "#components/format/index.ts";
  import { CartClient } from "#lib/entities/cart/client/index.ts";
  import OrderColumn from "./OrderColumn.svelte";

  // SSR safe since dialog should always be closed on initial rendering.
  // This matches tailwindcss's md breakpoint.
  // Initialize as true to show the column on desktop. When the dialog is opened
  // for the first time on mobile it works as normal.
  const greaterThanTWMDQuery = new MediaQuery("(width >= 768px)", false);
  const greaterThanTWMD = $derived(greaterThanTWMDQuery.current);

  const cart = $derived(await CartClient.getUserLatest());
  const cartTotalPrice = $derived(await cart.getTotalPrice());
</script>

{#snippet dialogNotch()}
  <div class="flex w-full justify-center py-1">
    <DialogButton
      aria-label="Apri/chiudi popup ordine"
      class="button-ghost h-2 w-12 rounded-full bg-mist-200 dark:bg-mist-800"
    ></DialogButton>
  </div>
{/snippet}

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <div class="p-2 md:hidden">
    {@render dialogNotch()}

    <DialogButton class="w-full" tabindex={-1}>
      <div class="flex items-center justify-between">
        <h2 class="font-bold">Ordine</h2>
        <p class="md:hidden">Totale: <FormatPrice price={cartTotalPrice} /></p>
      </div>
    </DialogButton>
  </div>

  <DialogContent forceOpen={greaterThanTWMD} overlay={!greaterThanTWMD}>
    <div
      class="border-mist-default text-default bg-default fixed inset-x-0 bottom-0 z-50 rounded-t-md border-t p-2 shadow md:static md:flex md:h-full md:flex-col"
      transition:slide={{ axis: greaterThanTWMD ? "x" : "y" }}
    >
      <div class="md:hidden">
        {@render dialogNotch()}
      </div>

      <OrderColumn
        onresult={() => {
          dialogContext.open = false;
        }}
      />
    </div>
  </DialogContent>
</DialogRoot>
