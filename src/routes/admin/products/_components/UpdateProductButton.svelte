<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import { Dialog } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import type { Product } from "#lib/entities/products/client/index.ts";
  import { updateProductForm } from "../_forms.remote.ts";
  import { updateProductFormSchema } from "../_schemas.ts";

  interface Props {
    product: Product;
  }

  const { product }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} aria-label="Modifica">
      <PencilIcon class="size-5" />
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white fixed z-50 top-1/2 left-1/2 -translate-1/2">
      <h2>Modifica prodotto</h2>

      <Form
        form={updateProductForm.preflight(updateProductFormSchema)}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <HiddenInput field={updateProductForm.fields.id} value={product.data.id} />
        <TextInput field={updateProductForm.fields.name} label="Nome" value={product.data.name} />
        <NumericInput field={updateProductForm.fields.price} label="Prezzo" value={product.data.price} />
        <CheckboxInput field={updateProductForm.fields.available} label="In vendita" checked={product.data.available} />

        <Button type="submit">Modifica</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>
