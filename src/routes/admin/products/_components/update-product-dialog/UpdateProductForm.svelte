<script lang="ts">
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import { updateProductForm } from "../../_forms.remote.ts";
  import { updateProductFormSchema } from "../../_schemas.ts";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  const form = $derived(updateProductForm.for(product.data.id).preflight(updateProductFormSchema));
</script>

<Form {form}>
  <HiddenInput field={form.fields.id} value={product.data.id} />
  <TextInput field={form.fields.name} label="Nome" value={product.data.name} />
  <NumericInput field={form.fields.price} label="Prezzo" value={product.data.price} />
  <CheckboxInput field={form.fields.available} label="In vendita" checked={product.data.available} />

  <Button type="submit">Salva</Button>
</Form>
