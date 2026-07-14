<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import Dialog from "#components/Dialog.svelte";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import AddProductOptionForm from "./AddProductOptionForm.svelte";
  import DeleteProductOptionForm from "./DeleteProductOptionForm.svelte";
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
    {@const options = await product.getOptions()}

    <div {...props} class="bg-white dialog-centered">
      <h2>Modifica prodotto</h2>

      <UpdateProductForm {product} />

      <h2>Opzioni</h2>

      {#each options as option (option.data.id)}
        <div>
          {option.data.name}
          <DeleteProductOptionForm {product} {option} />
        </div>
      {/each}

      <details>
        <summary>Aggiungi opzione</summary>

        <AddProductOptionForm {product} />
      </details>
    </div>
  {/snippet}
</Dialog>
