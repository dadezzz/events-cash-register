<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "#components/controls/index.ts";
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
    <Button type="button" {...props} {children} />
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white dialog-centered">
      <AddProductForm
        {category}
        onresult={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
