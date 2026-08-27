<script lang="ts">
  import { XIcon } from "phosphor-svelte";
  import * as v from "valibot";
  import { Form } from "#components/form/index.ts";
  import FieldErrors from "#components/form/input/FieldErrors.svelte";
  import { HiddenInput, NumericInput, RadioInput, TextInput } from "#components/form/input/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import { addOptionForm } from "../../_forms.remote.ts";
  import { addProductOptionFormSchema } from "../../_schemas.ts";

  interface Props {
    product: ProductClient;
    onresult: () => void;
    oncancel: () => void;
  }

  const { product, onresult, oncancel }: Props = $props();

  const form = $derived(addOptionForm.for(product.data.id).preflight(addProductOptionFormSchema));
</script>

<Form {form} {onresult} class="flex flex-col gap-2">
  <HiddenInput field={form.fields.productId} value={product.data.id} />

  <TextInput field={form.fields.name} label="Nome" />

  <RadioInput
    field={form.fields.data.type}
    label="Tipo di input"
    entries={addProductOptionFormSchema.entries.data.options.map((e) => ({
      value: e.entries.type.literal,
      label: v.getDescription(e.entries.type),
    }))}
  />

  {#if form.fields.data.type.value() === "boolean"}
    <NumericInput field={form.fields.data.price} label="Prezzo aggiuntivo" />
  {:else if form.fields.data.type.value() === "choice"}
    {#each form.fields.data.entries.value() as _, i (i)}
      <section class="border-mist-default rounded-md border p-2">
        <div class="flex items-center justify-between">
          <h3>Scelta {i + 1}</h3>

          <button
            type="button"
            class="button-ghost text-red-default p-1"
            onclick={() => {
              const arr = form.fields.data.entries.value();
              const itemsBefore = arr.slice(0, i);
              const itemsAfter = arr.slice(i + 1);
              form.fields.data.entries.set([...itemsBefore, ...itemsAfter]);
            }}
          >
            <XIcon class="size-4" />
          </button>
        </div>

        <TextInput field={form.fields.data.entries[i].value} label="Nome" />
        <NumericInput field={form.fields.data.entries[i].price} label="Prezzo aggiuntivo" />
      </section>
    {/each}

    <button
      type="button"
      class="button-ghost flex items-center gap-2"
      onclick={() => {
        const arr = form.fields.data.entries.value() ?? [];
        arr.push({ price: 0 });
        form.fields.data.entries.set(arr);
      }}
    >
      <div class="border-mist-default w-full border-b border-dashed"></div>
      <span class="text-nowrap text-mist-600 dark:text-mist-400">Aggiungi scelta</span>
      <div class="border-mist-default w-full border-b border-dashed"></div>
    </button>

    <FieldErrors errors={form.fields.data.entries.issues()} />
  {/if}

  <FieldErrors errors={form.fields.data.issues()} />

  <div class="mt-2 flex justify-end gap-2">
    <button type="button" class="button-secondary px-2 py-1" onclick={oncancel}>Annulla</button>
    <button type="submit" class="button-primary px-2 py-1">Salva</button>
  </div>
</Form>
