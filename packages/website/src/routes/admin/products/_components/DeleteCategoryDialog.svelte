<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { deleteCategoryForm } from "../_forms.remote.ts";

  interface Props {
    category: ProductCategoryClient;
  }

  const { category }: Props = $props();

  const form = $derived(deleteCategoryForm.for(category.data.id));

  const categoryProductsCount = $derived(await category.countProducts());
</script>

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <DialogButton aria-label="Elimina" disabled={categoryProductsCount > 0}>
    <TrashIcon class="size-5" />
  </DialogButton>

  <DialogContent>
    <div class="dialog-center dialog-inner" transition:fly>
      <h2>Elimina prodotto</h2>

      <p>Conferma di voler eliminare la categoria {category.data.name}</p>

      <Form
        {form}
        onresult={() => {
          dialogContext.open = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={category.data.id} />

        <DialogButton>Annulla</DialogButton>
        <button type="submit">Conferma</button>
      </Form>
    </div>
  </DialogContent>
</DialogRoot>
