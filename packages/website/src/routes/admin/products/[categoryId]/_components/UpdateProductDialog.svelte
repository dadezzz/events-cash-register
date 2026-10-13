<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import { getPopoverContext, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import { updateProductForm } from "../_forms.remote.ts";
  import { updateProductFormSchema } from "../_schemas.ts";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  const form = $derived(updateProductForm.for(product.data.id).preflight(updateProductFormSchema));
</script>

<PopoverRoot type="auto">
  {const popoverContext = getPopoverContext()}

  <PopoverButton aria-label="Modifica">
    <PencilIcon class="size-5" />
  </PopoverButton>

  <PopoverContent
    usePortal
    class="popover-floating-center popover-backdrop popover-floating-border popover-content p-2"
  >
    <h2>Modifica prodotto</h2>

    <Form
      {form}
      onresult={() => {
        popoverContext.open = false;
      }}
    >
      <HiddenInput field={form.fields.id} value={product.data.id} />
      <TextInput field={form.fields.name} label="Nome" value={product.data.name} />
      <NumericInput field={form.fields.price} label="Prezzo" value={product.data.price} />
      <CheckboxInput field={form.fields.available} label="In vendita" checked={product.data.available} />

      <PopoverButton>Annulla</PopoverButton>
      <button type="submit">Salva</button>
    </Form>
  </PopoverContent>
</PopoverRoot>
