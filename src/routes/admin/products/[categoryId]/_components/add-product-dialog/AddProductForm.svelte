<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { addProductForm } from "../../_forms.remote.ts";
  import { addProductFormSchema } from "../../_schemas.ts";

  interface Props {
    category: ProductCategoryClient;
    onresult: () => void;
    oncancel: () => void;
  }

  const { category, oncancel, onresult }: Props = $props();

  const form = addProductForm.preflight(addProductFormSchema);
</script>

<Form {form} {onresult} class="flex flex-col gap-2">
  <HiddenInput field={form.fields.categoryId} value={category.data.id} />

  <TextInput field={form.fields.name} label="Nome" />
  <NumericInput field={form.fields.price} label="Prezzo" />
  <CheckboxInput field={form.fields.available} label="In vendita" checked={true} />

  <div class="mt-2 flex justify-end gap-2">
    <button type="button" class="button-secondary px-2 py-1" onclick={oncancel}>Annulla</button>
    <button type="submit" class="button-primary px-2 py-1">Crea</button>
  </div>
</Form>
