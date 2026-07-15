<script lang="ts">
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { addProductForm } from "../../_forms.remote.ts";
  import { addProductFormSchema } from "../../_schemas.ts";

  interface Props {
    category: ProductCategoryClient;
    onresult: () => void;
  }

  const { category, onresult }: Props = $props();

  const form = addProductForm.preflight(addProductFormSchema);
</script>

<Form {form} {onresult}>
  <HiddenInput field={form.fields.categoryId} value={category.data.id} />

  <TextInput field={form.fields.name} label="Nome" />
  <NumericInput field={form.fields.price} label="Prezzo" />
  <CheckboxInput field={form.fields.available} label="In vendita" checked={true} />

  <Button type="submit">Crea</Button>
</Form>
