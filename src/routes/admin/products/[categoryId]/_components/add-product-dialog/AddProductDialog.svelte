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
    <button {...props} type="button" class="button-ghost-icon">
      <PlusIcon class="size-5" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inne" transition:fly>
      <AddProductForm
        {category}
        onresult={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
