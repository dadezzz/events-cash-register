<script lang="ts">
  import type { RemoteFormField } from "@sveltejs/kit";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput, RadioInput } from "#components/form/input/index.ts";
  import { FormatPrice } from "#components/format/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import { addProductToOrderForm } from "../_forms.remote.ts";
  import { addProductToOrderSchema } from "../_schemas.ts";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  const options = $derived(await product.getOptions());

  const form = $derived(addProductToOrderForm.for(product.data.id).preflight(addProductToOrderSchema));

  let dialogOpen = $state(false);
</script>

{#if options.length === 0}
  <Form {form}>
    <HiddenInput field={form.fields.productId} value={product.data.id} />
    <button type="submit" class="dialog-button">Aggiungi</button>
  </Form>
{:else}
  <Dialog bind:open={dialogOpen}>
    {#snippet trigger({ props })}
      <button {...props} type="button" class="dialog-button">Configura</button>
    {/snippet}
    {#snippet content({ props })}
      <div {...props} class="dialog-center dialog-inner" transition:fly>
        <h3>Configura prodotto da aggiungere</h3>

        <Form
          {form}
          onresult={() => {
            dialogOpen = false;
          }}
        >
          <HiddenInput field={form.fields.productId} value={product.data.id} />

          {#each options as option, i (option.data.id)}
            <HiddenInput field={form.fields.options[i].productOptionId} value={option.data.id} />

            {#if option.data.data.type === "boolean"}
              <div class="flex items-center gap-3">
                <CheckboxInput
                  field={form.fields.options[i].value as RemoteFormField<boolean>}
                  label={option.data.name}
                />
                <FormatPrice price={option.data.data.price} class="text-xs text-mist-500 " />
              </div>
            {:else if option.data.data.type === "choice"}
              <RadioInput
                field={form.fields.options[i].value as RemoteFormField<string>}
                entries={option.data.data.entries.map((e) => ({ value: e.value, label: e }))}
                label={option.data.name}
              >
                {#snippet entryUI({ label })}
                  <div class="group flex w-fit items-center gap-2">
                    <div
                      class="outline-emerald-default flex size-4 items-center justify-center rounded-full border border-mist-300 group-focus-within/radio:outline-2 group-hover:outline-2 group-has-[input:checked]/radio:border-emerald-600 dark:border-mist-600 dark:group-has-[input:checked]/radio:border-emerald-300"
                    >
                      <div
                        class="size-2 rounded-full group-has-[input:checked]/radio:bg-emerald-600 dark:group-has-[input:checked]/radio:bg-emerald-300"
                      ></div>
                    </div>

                    <div class="flex items-center gap-3">
                      <span class="text-mist-600 dark:text-mist-300">{label.value}</span>
                      <FormatPrice price={label.price} class="text-xs text-mist-500 " />
                    </div>
                  </div>
                {/snippet}
              </RadioInput>
            {/if}
          {/each}

          <button type="submit">Aggiungi</button>
        </Form>
      </div>
    {/snippet}
  </Dialog>
{/if}

<style>
  @reference "#assets/tailwind.css";

  .dialog-button {
    @apply outline-emerald-default w-full rounded-md border border-mist-400 bg-mist-200 px-2 py-1 text-mist-700 focus:outline-2 dark:border-mist-600 dark:bg-mist-800 dark:text-mist-300;
  }
</style>
