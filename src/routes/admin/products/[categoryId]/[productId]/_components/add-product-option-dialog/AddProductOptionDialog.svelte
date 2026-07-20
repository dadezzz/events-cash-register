<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import AddProductOptionForm from "./AddProductOptionForm.svelte";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button {...props} type="button" class="button-ghost-icon">
      <PlusIcon class="size-5" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div class="dialog-center flex max-h-screen">
      <div {...props} class="dialog-inner m-2 max-h-full max-w-md overflow-y-auto p-2" transition:fly>
        <h2 class="mb-2 text-xl font-bold">Aggiungi opzione</h2>

        <p class="mb-2">Le opzioni permettono di configurare il prodotto per adattarlo alle esigenze del cliente.</p>

        <AddProductOptionForm
          {product}
          onresult={() => {
            dialogOpen = false;
          }}
          oncancel={() => {
            dialogOpen = false;
          }}
        />
      </div>
    </div>
  {/snippet}
</Dialog>
