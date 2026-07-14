<script lang="ts">
  import { XIcon } from "phosphor-svelte";
  import * as v from "valibot";
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput, NumericInput, RadioInput, TextInput } from "#components/form/input/index.ts";
  import { iteratorToNumber } from "#lib/array.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import { addProductOptionForm } from "../../_forms.remote.ts";
  import { addProductOptionFormSchema } from "../../_schemas.ts";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  const form = $derived(addProductOptionForm.for(product.data.id).preflight(addProductOptionFormSchema));
  let entriesToAdd = $state(2);
</script>

<Form {form}>
  <HiddenInput field={form.fields.productId} value={product.data.id} />

  <TextInput field={form.fields.name} label="Nome" />

  <RadioInput
    field={form.fields.data.type}
    label="Tipo di input"
    entries={addProductOptionFormSchema.entries.data.options.map((e) => ({
      value: e.entries.type.literal,
      label: v.getDescription(e.entries.type),
    }))}
  >
    {#snippet entryUI({ checked, label })}
      <div class="group-has-[input:checked]/radio:bg-red-400">
        {checked ? "true" : "false"}
        {label}
      </div>
    {/snippet}
  </RadioInput>

  {#if form.fields.data.type.value() === "boolean"}
    <NumericInput field={form.fields.data.price} label="Prezzo aggiuntivo" />
  {:else if form.fields.data.type.value() === "choice"}
    {#each iteratorToNumber(0, entriesToAdd) as j (j)}
      <TextInput field={form.fields.data.entries[j].value} label="Nome" />
      <NumericInput field={form.fields.data.entries[j].price} label="Prezzo aggiuntivo" />

      <Button
        type="button"
        onclick={() => {
          for (let k = j; k < entriesToAdd; k++) {
            form.fields.data.entries[k].set(form.fields.data.entries[k + 1].value());
          }

          entriesToAdd = Math.max(entriesToAdd - 1, 2);
        }}
      >
        <XIcon class="size-4" />
      </Button>
    {/each}
  {/if}

  <Button type="submit">Salva</Button>
</Form>
