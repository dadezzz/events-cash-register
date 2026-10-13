<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { getPopoverContext, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import AddProductOptionForm from "./AddProductOptionForm.svelte";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();
</script>

<PopoverRoot type="auto">
  {const popoverContext = getPopoverContext()}

  <PopoverButton class="button-ghost p-1 text-mist-700 dark:text-mist-300">
    <PlusIcon class="size-4" />
  </PopoverButton>

  <PopoverContent
    usePortal
    class="popover-floating-center popover-backdrop popover-floating-border popover-content w-full p-2"
  >
    <h2 class="mb-2 text-xl font-bold">Aggiungi opzione</h2>

    <p class="mb-2">Le opzioni permettono di configurare il prodotto per adattarlo alle esigenze del cliente.</p>

    <AddProductOptionForm
      {product}
      onresult={() => {
        popoverContext.open = false;
      }}
    />
  </PopoverContent>
</PopoverRoot>
