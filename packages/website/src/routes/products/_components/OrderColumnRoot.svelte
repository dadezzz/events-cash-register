<script lang="ts">
  import { createDialogContext, DialogButton, DialogOverlay, DialogRoot } from "#components/dialog/index.ts";
  import { FormatPrice } from "#components/format/index.ts";
  import { CartClient } from "#lib/entities/cart/client/index.ts";
  import OrderColumnContent from "./OrderColumnContent.svelte";

  const cart = $derived(await CartClient.getUserLatest());
  const cartTotalPrice = $derived(await cart.getTotalPrice());

  const dialogId = $props.id();
  const dialogContext = $state(createDialogContext(dialogId));
</script>

{#snippet dialogNotch()}
  <div class="flex w-full justify-center py-1">
    <DialogButton
      aria-label="Apri/chiudi popup ordine"
      class="button-ghost h-2 w-12 rounded-full bg-mist-200 dark:bg-mist-800"
    ></DialogButton>
  </div>
{/snippet}

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape") {
      dialogContext.open = false;
    }
  }}
/>

<DialogRoot context={dialogContext}>
  <div class="p-2 md:hidden">
    {@render dialogNotch()}

    <DialogButton class="w-full" tabindex={-1}>
      <div class="flex items-center justify-between">
        <h2 class="font-bold">Ordine</h2>
        <p class="md:hidden">Totale: <FormatPrice price={cartTotalPrice} /></p>
      </div>
    </DialogButton>
  </div>

  <DialogOverlay class="md:data-[open=true]:hidden" />

  <dialog
    open
    id={dialogContext.id}
    data-open={dialogContext.open}
    class="border-mist-default text-default bg-default fixed bottom-0 z-50 translate-y-full p-2 shadow data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:duration-200 max-md:invisible max-md:w-full max-md:rounded-t-lg max-md:border-t max-md:transition-[translate,visibility] md:static md:h-full md:translate-y-0"
  >
    <div class="md:hidden">
      {@render dialogNotch()}
    </div>

    <aside class="flex h-full flex-col">
      <OrderColumnContent
        onresult={() => {
          dialogContext.open = false;
        }}
      />
    </aside>
  </dialog>
</DialogRoot>
