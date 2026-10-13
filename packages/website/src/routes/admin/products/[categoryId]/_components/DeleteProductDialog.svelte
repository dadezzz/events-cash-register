<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import { getPopoverContext, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import { deleteProductForm } from "../_forms.remote.ts";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  const form = $derived(deleteProductForm.for(product.data.id));
</script>

<PopoverRoot type="auto">
  {const popoverContext = getPopoverContext()}

  <PopoverButton aria-label="Elimina">
    <TrashIcon class="size-5" />
  </PopoverButton>

  <PopoverContent
    usePortal
    class="popover-floating-center popover-backdrop popover-floating-border popover-content p-2"
  >
    <h2>Elimina prodotto</h2>

    <p>Conferma di voler eliminare il prodotto {product.data.name}</p>

    <Form
      {form}
      onresult={() => {
        popoverContext.open = false;
      }}
    >
      <HiddenInput field={form.fields.id} value={product.data.id} />

      <PopoverButton>Annulla</PopoverButton>
      <button type="submit">Conferma</button>
    </Form>
  </PopoverContent>
</PopoverRoot>
