<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import { FormatPrice } from "#components/format/index.ts";
  import { getPopoverContext, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import { CartClient } from "#lib/entities/cart/client/index.ts";
  import OrderColumnContent from "./OrderColumnContent.svelte";

  const cart = $derived(await CartClient.getUserLatest());
  const cartTotalPrice = $derived(await cart.getTotalPrice());

  // Matches Tailwindcss's md breakpoint.
  const greaterThanTWMDQuery = new MediaQuery("(width >= 768px)", true);
  const greaterThanTWMD = $derived(greaterThanTWMDQuery.current);
</script>

{#snippet dialogNotch()}
  <div class="flex w-full justify-center py-1">
    <PopoverButton
      aria-label="Apri/chiudi popup ordine"
      class="button-ghost h-2 w-12 rounded-full bg-mist-200 dark:bg-mist-800"
    ></PopoverButton>
  </div>
{/snippet}

<PopoverRoot type={greaterThanTWMD ? "js" : "auto"}>
  {const popoverContext = getPopoverContext()}

  <div class="p-2 md:hidden">
    {@render dialogNotch()}

    <PopoverButton class="w-full" tabindex={-1}>
      <div class="flex items-center justify-between">
        <h2 class="font-bold">Ordine</h2>
        <p class="md:hidden">Totale: <FormatPrice price={cartTotalPrice} /></p>
      </div>
    </PopoverButton>
  </div>

  <PopoverContent
    usePortal={!greaterThanTWMD}
    closeOnNav={!greaterThanTWMD}
    class="border-mist-default popover-content popover-backdrop bottom-0 z-50 m-0 mt-auto h-0 w-full p-2 transition-[height,overlay] transition-discrete data-[open=true]:h-fit max-md:rounded-t-md max-md:border max-md:border-b-0 max-md:shadow md:h-full md:backdrop:hidden data-[open=true]:starting:h-0"
  >
    <div class="md:hidden">
      {@render dialogNotch()}
    </div>

    <aside class="flex h-full flex-col">
      <OrderColumnContent
        onresult={() => {
          popoverContext.open = false;
        }}
      />
    </aside>
  </PopoverContent>
</PopoverRoot>
