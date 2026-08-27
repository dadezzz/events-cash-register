<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
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
    <button type="button" {...props} aria-label="Modifica">
      <PencilIcon class="size-5" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inner" transition:fly>
      <h2>Modifica prodotto</h2>

      <UpdateProductForm {product} />
    </div>
  {/snippet}
</Dialog>
