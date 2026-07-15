<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import Dialog from "#components/Dialog.svelte";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import UpdateProductForm from "./UpdateProductForm.svelte";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} aria-label="Modifica">
      <PencilIcon class="size-5" />
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white dialog-centered">
      <h2>Modifica prodotto</h2>

      <UpdateProductForm {product} />
    </div>
  {/snippet}
</Dialog>
