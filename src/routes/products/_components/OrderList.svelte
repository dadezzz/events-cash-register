<script lang="ts">
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

  const orderForm = createOrderForm.preflight(createOrderSchema);
</script>

<div class="flex flex-col h-full">
  <div class="flex items-center justify-between">
    <h2 class="font-bold">Ordine</h2>
    <p class="md:hidden">Totale: <FormatPrice price={orderTotal} /></p>
  </div>

  <ul class="hidden md:block">
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
    <Form form={orderForm} class="mt-auto hidden md:block">
      <NumericInput field={orderForm.fields.finalPrice} value={orderTotal} label="Prezzo totale" />

      <button
        type="submit"
        class="w-full dark:bg-emerald-700 hover:bg-emerald-300 dark:hover:bg-emerald-600 bg-emerald-200 font-semibold rounded-md py-1 mt-2 focus:outline-2 outline-emerald-default"
      >
        Invia
      </button>
    </Form>
  </div>
</div>
