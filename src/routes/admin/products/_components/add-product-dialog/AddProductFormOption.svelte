<script lang="ts" module>
  // Compute once and use for all components.
  const optionTypeEntries = addProductFormSchema.entries.options.wrapped.item.entries.data.options.map((e) => ({
    value: e.entries.type.literal,
    label: v.getDescription(e.entries.type),
  }));
</script>

<script lang="ts">
  import { XIcon } from "phosphor-svelte";
  import * as v from "valibot";
  import { Button } from "#components/controls/index.ts";
  import { NumericInput, RadioInput, TextInput } from "#components/form/input/index.ts";
  import { iteratorToNumber } from "#lib/array.ts";
  import { productOptionChoiceMinEntries } from "#lib/entities/products/option/index.ts";
  import type { addProductForm } from "../../_forms.remote.ts";
  import { addProductFormSchema } from "../../_schemas.ts";

  interface Props {
    form: typeof addProductForm;
    index: number;
    ondelete: () => void;
  }

  const { form, index, ondelete }: Props = $props();

  const optionField = $derived(form.fields.options[index]);
  let entriesToAdd = $state(productOptionChoiceMinEntries);
</script>

<div>
  <TextInput field={optionField.name} label="Nome" />

  <RadioInput field={optionField.data.type} label="Tipo di input" entries={optionTypeEntries}>
    {#snippet entryUI({ checked, label })}
      <div class="group-has-[input:checked]/radio:bg-red-400">
        {checked ? "true" : "false"}
        {label}
      </div>
    {/snippet}
  </RadioInput>

  {#if optionField.data.type.value() === "boolean"}
    <NumericInput field={optionField.data.price} label="Prezzo aggiuntivo" />
  {:else if optionField.data.type.value() === "choice"}
    {#each iteratorToNumber(0, entriesToAdd) as j (j)}
      <TextInput field={optionField.data.entries[j].value} label="Nome" />
      <NumericInput field={optionField.data.entries[j].price} label="Prezzo aggiuntivo" />

      <Button
        type="button"
        onclick={() => {
          for (let k = j; k < entriesToAdd; k++) {
            optionField.data.entries[k].set(optionField.data.entries[k + 1].value());
          }

          entriesToAdd = Math.max(entriesToAdd - 1, productOptionChoiceMinEntries);
        }}
      >
        <XIcon class="size-4" />
      </Button>
    {/each}
  {/if}

  <Button type="button" onclick={ondelete}>
    <XIcon class="size-4" />
  </Button>
</div>
