<script lang="ts">
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import NumericInput from "#components/form/input/NumericInput.svelte";
  import PageWithSidebar from "#components/layouts/PageWithSidebar.svelte";
  import { requireUser } from "#lib/auth/index.remote.ts";
  import { CartClient } from "#lib/entities/cart/client/index.ts";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { ProductOptionClient } from "#lib/entities/products/option/client/index.ts";
  import ProductOptionInput from "./_components/ProductOptionInput.svelte";
  import { addProductToOrderForm, createOrderForm } from "./_forms.remote.ts";
  import { addProductToOrderSchema, createOrderSchema } from "./_schemas.ts";

  await requireUser();

  const categories = $derived(await ProductCategoryClient.getAll());

  const form = addProductToOrderForm.preflight(addProductToOrderSchema);
  const orderForm = createOrderForm.preflight(createOrderSchema);

  let selectedCategory: ProductCategoryClient | null = $state(null);

  const cart = $derived(await CartClient.getUserLatest());
  const cartItems = $derived(await cart.getItems());
</script>

<PageWithSidebar>
  <div class="flex h-full">
    <div class="flex list-column">
      <ul class="flex gap-2">
        {#each categories as category (category.data.id)}
          <li class="bg-slate-100 dark:bg-slate-800 rounded-md p-1">
            <Button
              type="button"
              onclick={() => {
                selectedCategory = category;
              }}
            >
              {category.data.name}
            </Button>
          </li>
        {/each}
      </ul>

      {#if selectedCategory}
        {@const products = await selectedCategory.getProducts()}

        {#each products as product}
          {@const options = await product.getOptions()}
          {@const f = form.for(product.data.id)}

          <div>{product.data.name} {product.data.price}</div>

          <Form form={f}>
            <HiddenInput field={f.fields.productId} value={product.data.id} />

            {#each options as option, i (option.data.id)}
              <HiddenInput field={f.fields.options[i].productOptionId} value={option.data.id} />
              <ProductOptionInput field={f.fields.options[i].value} {option} />
            {/each}

            <Button type="submit">Aggiungi</Button>
          </Form>
        {/each}
      {:else}
        <div class="flex h-full items-center justify-center">
          <p>Seleziona una categoria</p>
        </div>
      {/if}
    </div>

    <div class="md:flex hidden list-column">
      <h2 class="font-bold">Ordine</h2>

      <ul>
        {#each cartItems as cartItem (cartItem.data.id)}
          {@const product = await cartItem.getProduct()}
          {@const values = await cartItem.getValues()}

          <li>
            {product.data.name}

            <ul class="ml-2">
              {#each values as value (value.productOptionId)}
                {@const productOption = await ProductOptionClient.fromId(value.productOptionId)}
                <li>{productOption.data.name} - {value.value}</li>
              {/each}
            </ul>
          </li>
        {/each}
      </ul>

      <Form form={orderForm} class="mt-auto">
        <NumericInput field={orderForm.fields.discount} value={0} label="Modifica prezzo" />

        <Button type="submit">Invia</Button>
      </Form>
    </div>
  </div>
</PageWithSidebar>

<style>
  @reference "#assets/tailwind.css";

  .list-column {
    @apply w-full flex-col border-slate-300 p-2 not-first:border-l;
  }
</style>
