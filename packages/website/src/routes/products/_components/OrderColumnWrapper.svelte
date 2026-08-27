<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import { slide } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { FormatPrice } from "#components/format/index.ts";
  import { CartClient } from "#lib/entities/cart/client/index.ts";
  import OrderColumn from "./OrderColumn.svelte";

  let showDialog = $state(false);
  let showColumn = $state(true);

  // SSR safe since dialog should always be closed on initial rendering.
  // This matches tailwindcss's md breakpoint.
  // Initialize as true to show the column on desktop. When the dialog is opened
  // for the first time on mobile it works as normal.
  const greaterThanTWMDQuery = new MediaQuery("(width >= 768px)", true);
  const greaterThanTWMD = $derived(greaterThanTWMDQuery.current);

  // - Disables opening the dialog on desktop.
  // - Unmounts the form in the column BEFORE opening the dialog.
  function setShowDialog(v: boolean) {
    if (greaterThanTWMD) {
      v = false;
    }

    if (v) {
      showColumn = false;
    }

    showDialog = v;
  }

  // Returns the value of showDialog only on mobile.
  function getShowDialog() {
    return !greaterThanTWMD && showDialog;
  }

  // Returns the value of showColumn only on desktop. On mobile, except on page
  // load for SSR, the column is always unmounted.
  function getShowColumn() {
    return greaterThanTWMD && showColumn;
  }

  const cart = $derived(await CartClient.getUserLatest());
  const cartTotalPrice = $derived(await cart.getTotalPrice());
</script>

{#snippet dialogNotch()}
  <div class="flex w-full justify-center py-1">
    <button
      type="button"
      aria-label="Apri/chiudi popup ordine"
      class="button-ghost h-2 w-12 rounded-full bg-mist-200 dark:bg-mist-800"
      onclick={() => {
        setShowDialog(!showDialog);
      }}
    ></button>
  </div>
{/snippet}

<Dialog bind:open={getShowDialog, setShowDialog}>
  {#snippet trigger({ props })}
    <div class="p-2 md:hidden">
      {@render dialogNotch()}

      <button {...props} type="button" class="w-full" tabindex={-1}>
        <div class="flex items-center justify-between">
          <h2 class="font-bold">Ordine</h2>
          <p class="md:hidden">Totale: <FormatPrice price={cartTotalPrice} /></p>
        </div>
      </button>
    </div>
  {/snippet}
  {#snippet content({ props })}
    <div
      {...props}
      class="border-mist-default bg-default text-default fixed inset-x-0 bottom-0 z-50 rounded-t-md border-t p-2 shadow"
      transition:slide
      onoutroendcapture={() => {
        showColumn = true;
      }}
    >
      {@render dialogNotch()}

      {#if showDialog}
        <OrderColumn
          onresult={() => {
            setShowDialog(false);
          }}
        />
      {/if}
    </div>
  {/snippet}
</Dialog>

<div class="flex h-full flex-col p-2 not-md:hidden">
  {#if getShowColumn()}
    <OrderColumn
      onresult={() => {
        setShowDialog(false);
      }}
    />
  {/if}
</div>
