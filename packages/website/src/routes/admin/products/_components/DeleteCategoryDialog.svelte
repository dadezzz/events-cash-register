<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import { getPopoverContext, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { deleteCategoryForm } from "../_forms.remote.ts";

  interface Props {
    category: ProductCategoryClient;
  }

  const { category }: Props = $props();

  const form = $derived(deleteCategoryForm.for(category.data.id));

  const categoryProductsCount = $derived(await category.countProducts());
</script>

<PopoverRoot type="auto">
  {const popoverContext = getPopoverContext()}

  <PopoverButton aria-label="Elimina" disabled={categoryProductsCount > 0}>
    <TrashIcon class="size-5" />
  </PopoverButton>

  <PopoverContent
    usePortal
    class="popover-floating-center popover-backdrop popover-floating-border popover-content p-2"
  >
    <h2>Elimina prodotto</h2>

    <p>Conferma di voler eliminare la categoria {category.data.name}</p>

    <Form
      {form}
      onresult={() => {
        popoverContext.open = false;
      }}
    >
      <HiddenInput field={form.fields.id} value={category.data.id} />

      <PopoverButton>Annulla</PopoverButton>
      <button type="submit">Conferma</button>
    </Form>
  </PopoverContent>
</PopoverRoot>
