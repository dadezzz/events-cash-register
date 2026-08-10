<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { addProductForm } from "../_forms.remote.ts";
  import { addProductFormSchema } from "../_schemas.ts";

  interface Props {
    category: ProductCategoryClient;
  }

  const { category }: Props = $props();

  let dialogOpen = $state(false);

  const form = addProductForm.preflight(addProductFormSchema);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button {...props} type="button" class="button-ghost p-1 text-mist-700 dark:text-mist-300">
      <PlusIcon class="size-4" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inner p-2" transition:fly>
      <h2 class="mb-2 text-xl font-bold">Aggiungi prodotto</h2>

      <p class="mb-2">Il prodotto è ciò che viene venduto al cliente</p>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
        class="flex flex-col gap-2"
      >
        <HiddenInput field={form.fields.categoryId} value={category.data.id} />

        <TextInput field={form.fields.name} label="Nome" />
        <NumericInput field={form.fields.price} label="Prezzo" />
        <CheckboxInput field={form.fields.available} label="In vendita" checked={true} />

        <div class="mt-2 flex justify-end gap-2">
          <button
            type="button"
            class="button-secondary px-2 py-1"
            onclick={() => {
              dialogOpen = false;
            }}
          >
            Annulla
          </button>
          <button type="submit" class="button-primary px-2 py-1">Crea</button>
        </div>
      </Form>
    </div>
  {/snippet}
</Dialog>
