<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { addProductForm } from "../_forms.remote.ts";
  import { addProductFormSchema } from "../_schemas.ts";

  interface Props {
    category: ProductCategoryClient;
  }

  const { category }: Props = $props();

  const form = addProductForm.preflight(addProductFormSchema);
</script>

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <DialogButton class="button-ghost p-1 text-mist-700 dark:text-mist-300">
    <PlusIcon class="size-4" />
  </DialogButton>

  <DialogContent>
    <div class="dialog-center dialog-inner p-2" transition:fly>
      <h2 class="mb-2 text-xl font-bold">Aggiungi prodotto</h2>

      <p class="mb-2">Il prodotto è ciò che viene venduto al cliente</p>

      <Form
        {form}
        class="flex flex-col gap-2"
        onresult={() => {
          dialogContext.open = false;
        }}
      >
        <HiddenInput field={form.fields.categoryId} value={category.data.id} />

        <TextInput field={form.fields.name} label="Nome" />
        <NumericInput field={form.fields.price} label="Prezzo" />
        <CheckboxInput field={form.fields.available} label="In vendita" checked={true} />

        <div class="mt-2 flex justify-end gap-2">
          <DialogButton class="button-secondary px-2 py-1">Annulla</DialogButton>
          <button type="submit" class="button-primary px-2 py-1">Crea</button>
        </div>
      </Form>
    </div>
  </DialogContent>
</DialogRoot>
