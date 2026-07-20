<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import { slide } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { NumericInput } from "#components/form/input/index.ts";
  import { FormatPrice } from "#components/format/index.ts";
  import { CartClient } from "#lib/entities/cart/client/index.ts";
  import { ProductOptionClient } from "#lib/entities/products/option/client/index.ts";
  import { createOrderForm } from "../_forms.remote.ts";
  import { createOrderSchema } from "../_schemas.ts";

  const cart = $derived(await CartClient.getUserLatest());
  const cartItems = $derived(await cart.getItems());

  const orderTotal = $derived(
    (
      await Promise.all(
        cartItems.map(async (c) => {
          const product = await c.getProduct();
          const values = await c.getValues();

          let sum = product.data.price;
          for (const v of values) {
            if (v.price === null) return null;
            sum += v.price;
          }

          return sum;
        }),
      )
    ).reduce((a, b) => {
      if (a === null || b === null) {
        return null;
      }

      return a + b;
    }, 0),
  );

  const form = createOrderForm.preflight(createOrderSchema);

  let dialogOpen = $state(false);

  // SSR safe since dialog should always be closed on initial rendering.
  // This matches tailwindcss's md breakpoint.
  const greaterThanTWMDQuery = new MediaQuery("(width >= 768px)", false);
  const greaterThanTWMD = $derived(greaterThanTWMDQuery.current);
</script>

{#snippet column(formId: string)}
  {@const f = form.for(formId)}

  <h2 class="font-bold">Ordine</h2>

  <ul>
    {#each cartItems as cartItem (cartItem.data.id)}
      {@const product = await cartItem.getProduct()}
      {@const values = await cartItem.getValues()}

      <li>
        {product.data.name}

        <ul class="ml-2">
          {#each values as value (value.optionId)}
            {@const productOption = await ProductOptionClient.fromId(value.optionId)}
            <li>{productOption.data.name} - {value.value}</li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>

  <div class="mt-auto">
    <Form
      form={f}
      onresult={()=> {
        dialogOpen = false;
      }}
    >
      <NumericInput field={f.fields.finalPrice} value={orderTotal} label="Prezzo totale" />

      <button
        type="submit"
        class="button-primary mt-2 w-full py-1 disabled:bg-mist-200 dark:disabled:bg-mist-800"
        disabled={!orderTotal}
      >
        Invia
      </button>
    </Form>
  </div>
{/snippet}

{#snippet dialogNotch()}
  <div class="flex w-full justify-center py-1">
    <button
      type="button"
      aria-label="Apri/chiudi popup ordine"
      class="bg-mist-200 button-ghost h-2 w-12 rounded-full dark:bg-mist-800"
      onclick={() => {
        dialogOpen = !dialogOpen;
      }}
    ></button>
  </div>
{/snippet}

<Dialog
  bind:open={() => !greaterThanTWMD && dialogOpen, (v) => {
      if (!greaterThanTWMD) dialogOpen = v;
    }}
>
  {#snippet trigger({ props })}
    <div class="md:hidden">
      {@render dialogNotch()}

      <button {...props} type="button" class="w-full" tabindex={-1}>
        <div class="flex items-center justify-between">
          <h2 class="font-bold">Ordine</h2>
          <p class="md:hidden">Totale: <FormatPrice price={orderTotal} /></p>
        </div>
      </button>
    </div>
  {/snippet}
  {#snippet content({ props })}
    <div
      {...props}
      class="border-mist-default bg-default text-default fixed inset-x-0 bottom-0 z-50 rounded-t-md border-t p-2 shadow"
      transition:slide
    >
      {@render dialogNotch()}
      {@render column("md")}
    </div>
  {/snippet}
</Dialog>

<div class="flex h-full flex-col max-md:hidden">
  {@render column("max-md")}
</div>
