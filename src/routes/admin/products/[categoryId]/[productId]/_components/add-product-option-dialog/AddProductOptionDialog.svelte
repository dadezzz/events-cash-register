<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "#components/controls/index.ts";
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
    <Button type="button" {...props} {children} />
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white dialog-centered">
      <AddProductOptionForm
        {product}
        onresult={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
