<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import type { ProductOptionClient } from "#lib/entities/products/option/client/index.ts";
  import { deleteOptionForm } from "../_forms.remote.ts";

  interface Props {
    product: ProductClient;
    option: ProductOptionClient;
  }

  const { product, option }: Props = $props();

  const form = $derived(deleteOptionForm.for(option.data.id));
</script>

<Form {form}>
  <HiddenInput field={form.fields.productId} value={product.data.id} />
  <HiddenInput field={form.fields.id} value={option.data.id} />

  <button type="submit" aria-label="Elimina">
    <TrashIcon class="size-5" />
  </button>
</Form>
