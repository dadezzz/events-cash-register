<script lang="ts">
  import type { Snippet } from "svelte";
  import Dialog from "#components/Dialog.svelte";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import AddProductForm from "./AddProductForm.svelte";

  interface Props {
    category: ProductCategoryClient;
    children: Snippet;
  }

  const { category, children }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button type="button" {...props}>
      {@render children()}
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-default">
      <AddProductForm
        {category}
        onresult={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
