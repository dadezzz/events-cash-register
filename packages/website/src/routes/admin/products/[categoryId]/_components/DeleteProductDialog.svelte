<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import { deleteProductForm } from "../_forms.remote.ts";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  const form = $derived(deleteProductForm.for(product.data.id));
  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button type="button" {...props} aria-label="Elimina">
      <TrashIcon class="size-5" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inner" transition:fly>
      <h2>Elimina prodotto</h2>

      <p>Conferma di voler eliminare il prodotto {product.data.name}</p>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={product.data.id} />

        <button
          type="button"
          onclick={() => {
            dialogOpen = false;
          }}
        >
          Annulla
        </button>
        <button type="submit">Conferma</button>
      </Form>
    </div>
  {/snippet}
</Dialog>
