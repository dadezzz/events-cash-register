<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import AddProductForm from "./AddProductForm.svelte";

  interface Props {
    category: ProductCategoryClient;
  }

  const { category }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button {...props} type="button" class="button-ghost p-1 text-mist-700 dark:text-mist-300">
      <PlusIcon class="size-4" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inner p-2" transition:fly>
      <h2 class="mb-2 text-xl font-bold">Aggiungi prodotto</h2>

      <p class="mb-2">Il prodotto è ciò che viene venduto al cliente</p>

      <AddProductForm
        {category}
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
