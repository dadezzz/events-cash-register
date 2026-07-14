<script lang="ts">
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import { iteratorToNumber } from "#lib/array.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { addProductForm } from "../../_forms.remote.ts";
  import { addProductFormSchema } from "../../_schemas.ts";
  import AddProductFormOption from "./AddProductFormOption.svelte";

  interface Props {
    category: ProductCategoryClient;
    onresult: () => void;
  }

  const { category, onresult }: Props = $props();

  const form = addProductForm.preflight(addProductFormSchema);
  let optionsToAdd = $state(0);
</script>

<Form {form} {onresult}>
  <HiddenInput field={form.fields.categoryId} value={category.data.id} />

  <TextInput field={form.fields.name} label="Nome" />
  <NumericInput field={form.fields.price} label="Prezzo" />
  <CheckboxInput field={form.fields.available} label="In vendita" checked={true} />

  <Button
    type="button"
    onclick={() => {
      optionsToAdd += 1;
    }}
  >
    Aggiungi opzione
  </Button>

  {#each iteratorToNumber(0, optionsToAdd) as index (index)}
    <AddProductFormOption
      {form}
      {index}
      ondelete={() => {
        for (let j = index; j < optionsToAdd; j++) {
          form.fields.options[j].set(form.fields.options[j + 1].value());
        }

        optionsToAdd -= 1;
      }}
    />
  {/each}

  <Button type="submit">Crea</Button>
</Form>
