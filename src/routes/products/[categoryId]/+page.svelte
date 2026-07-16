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

  <div class="page-section p-2 w-full h-full overflow-y-auto">
    <ul class="gap-2 grid md:grid-cols-2 lg:grid-cols-3">
      {#each products as product}
        <li class="border-mist-200 dark:border-mist-800 border rounded-md p-2 flex flex-col gap-3">
          <div class="flex justify-between items-center">
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
