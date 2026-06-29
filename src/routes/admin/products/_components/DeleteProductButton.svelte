<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import { Dialog, DialogClose } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { Product } from "#lib/entities/products/client/index.ts";
  import { deleteProductForm } from "../_forms.remote.ts";

  interface Props {
    product: Product;
  }

  const { product }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} aria-label="Elimina">
      <TrashIcon class="size-5" />
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white fixed z-50 top-1/2 left-1/2 -translate-1/2">
      <h2>Elimina prodotto</h2>

      <p>Conferma di voler eliminare il prodotto {product.data.name}</p>

      <Form
        form={deleteProductForm}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <HiddenInput field={deleteProductForm.fields.id} value={product.data.id} />

        <DialogClose type="button">Annulla</DialogClose>
        <Button type="submit">Conferma</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>
