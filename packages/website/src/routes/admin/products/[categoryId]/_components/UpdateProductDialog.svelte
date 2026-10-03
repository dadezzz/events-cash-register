<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import { updateProductForm } from "../_forms.remote.ts";
  import { updateProductFormSchema } from "../_schemas.ts";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  const form = $derived(updateProductForm.for(product.data.id).preflight(updateProductFormSchema));
</script>

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <DialogButton aria-label="Modifica">
    <PencilIcon class="size-5" />
  </DialogButton>

  <DialogContent>
    <div class="dialog-center dialog-inner" transition:fly>
      <h2>Modifica prodotto</h2>

      <Form
        {form}
        onresult={() => {
          dialogContext.open = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={product.data.id} />
        <TextInput field={form.fields.name} label="Nome" value={product.data.name} />
        <NumericInput field={form.fields.price} label="Prezzo" value={product.data.price} />
        <CheckboxInput field={form.fields.available} label="In vendita" checked={product.data.available} />

        <DialogButton>Annulla</DialogButton>
        <button type="submit">Salva</button>
      </Form>
    </div>
  </DialogContent>
</DialogRoot>
