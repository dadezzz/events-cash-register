<script lang="ts">
  import type { Snippet } from "svelte";
  import Dialog from "#components/Dialog.svelte";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import AddProductOptionForm from "./AddProductOptionForm.svelte";

  interface Props {
    product: ProductClient;
    children: Snippet;
  }

  const { product, children }: Props = $props();

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
      <AddProductOptionForm
        {product}
        onresult={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
