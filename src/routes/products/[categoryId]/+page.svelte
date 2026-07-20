<script lang="ts">
  import { FormatPrice } from "#components/format/index.ts";
  import Header from "#components/Header.svelte";
  import { requireUser } from "#lib/auth/index.remote.ts";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import type { ProductCategoryId } from "#lib/entities/products/category/id.ts";
  import CategoriesList from "../_components/CategoriesList.svelte";
  import OrderList from "../_components/OrderList.svelte";
  import FormOrConfigureDialog from "./_components/FormOrConfigureDialog.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  await requireUser();

  const category = $derived(await ProductCategoryClient.fromId(params.categoryId as ProductCategoryId));
  const products = $derived(await category.getProducts());
</script>

<Header />

<div class="flex min-h-0 grow flex-col md:flex-row">
  <div class="page-section p-1">
    <CategoriesList selectedCategory={category} />
  </div>

  <div class="page-section @container h-full w-full overflow-y-auto p-2">
    <h2 class="font-semibold">Prodotti</h2>

    <ul class="grid gap-2 @md:grid-cols-2 @lg:grid-cols-3">
      {#each products as product}
        <li class="flex flex-col gap-3 rounded-md border border-mist-200 p-2 dark:border-mist-800">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold">{product.data.name}</span>
            <FormatPrice price={product.data.price} class="text-xs text-mist-600 dark:text-mist-400" />
          </div>

          <FormOrConfigureDialog {product} />
        </li>
      {/each}
    </ul>
  </div>

  <div class="page-section shrink-0 overflow-y-auto p-2">
    <OrderList />
  </div>
</div>

<style>
  @reference "#assets/tailwind.css";

  .page-section {
    @apply border-mist-default not-md:not-first:border-t md:not-first:border-l;
  }
</style>
