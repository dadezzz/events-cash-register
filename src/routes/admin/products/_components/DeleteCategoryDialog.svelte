<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { deleteProductCategoryForm } from "../_forms.remote.ts";

  interface Props {
    category: ProductCategoryClient;
  }

  const { category }: Props = $props();

  const form = $derived(deleteProductCategoryForm.for(category.data.id));
  let dialogOpen = $state(false);

  const categoryProductsCount = $derived(await category.countProducts());
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} aria-label="Elimina" disabled={categoryProductsCount > 0}>
      <TrashIcon class="size-5" />
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white dialog-centered">
      <h2>Elimina prodotto</h2>

      <p>Conferma di voler eliminare la categoria {category.data.name}</p>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={category.data.id} />

        <Button
          type="button"
          onclick={() => {
            dialogOpen = false;
          }}
        >
          Annulla
        </Button>
        <Button type="submit">Conferma</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>
