<script lang="ts">
  import type { RemoteFormField } from "@sveltejs/kit";
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
      <div {...props} class="dialog-default">
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
              <div class="flex gap-3 items-center">
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
                  <div class="flex gap-2 items-center w-fit group">
                    <div
                      class="flex items-center justify-center group-hover:outline-2 outline-emerald-default size-4 border border-mist-300 dark:border-mist-600 group-has-[input:checked]/radio:border-emerald-600 dark:group-has-[input:checked]/radio:border-emerald-300 rounded-full"
                    >
                      <div
                        class="size-2 group-has-[input:checked]/radio:bg-emerald-600 dark:group-has-[input:checked]/radio:bg-emerald-300 rounded-full"
                      ></div>
                    </div>

                    <div class="flex gap-3 items-center">
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
    @apply rounded-md border dark:bg-mist-800 dark:border-mist-600 dark:text-mist-300 py-1 w-full px-2 focus:outline-2 outline-emerald-default;
  }
</style>
