<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { NumericInput } from "#components/form/input/index.ts";
  import { CartClient } from "#lib/entities/cart/client/index.ts";
  import { ProductOptionClient } from "#lib/entities/products/option/client/index.ts";
  import { createOrderForm } from "../_forms.remote.ts";
  import { createOrderFormSchema } from "../_schemas.ts";
  import DeleteCartItemForm from "./DeleteCartItemForm.svelte";

  interface Props {
    onresult: () => Promise<void> | void;
  }

  const { onresult }: Props = $props();

  const form = createOrderForm.preflight(createOrderFormSchema);

  const cart = $derived(await CartClient.getUserLatest());
  const cartItems = $derived(await cart.getItems());
  const cartTotalPrice = $derived(await cart.getTotalPrice());
</script>

<h2 class="font-bold">Ordine</h2>

<ul>
  {#each cartItems as cartItem (cartItem.data.id)}
    {@const product = await cartItem.getProduct()}
    {@const values = await cartItem.getValues()}

    <li>
      {product.data.name}

      <DeleteCartItemForm {cartItem} />

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
  <Form {form} {onresult}>
    <NumericInput field={form.fields.finalPrice} value={cartTotalPrice} label="Prezzo totale" />

    <button
      type="submit"
      class="button-primary mt-2 w-full py-1 disabled:bg-mist-200 dark:disabled:bg-mist-800"
      disabled={!cartTotalPrice}
    >
      Invia
    </button>
  </Form>
</div>
