<script lang="ts">
  import { ArrowLeftIcon, PlusIcon } from "phosphor-svelte";
  import { A } from "#components/controls/index.ts";
  import PageWithSidebar from "#components/layouts/PageWithSidebar.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import type { ProductCategoryId } from "#lib/entities/products/category/id.ts";
  import { ProductClient } from "#lib/entities/products/client/index.ts";
  import type { ProductId } from "#lib/entities/products/id.ts";
  import AddCategoryDialog from "../../_components/add-category-dialog/AddCategoryDialog.svelte";
  import CategoriesList from "../../_components/CategoriesList.svelte";
  import AddProductDialog from "../_components/add-product-dialog/AddProductDialog.svelte";
  import ProductsList from "../_components/ProductsList.svelte";
  import AddProductOptionDialog from "./_components/add-product-option-dialog/AddProductOptionDialog.svelte";
  import ProductOptionsList from "./_components/ProductOptionsList.svelte";
  import type { PageProps } from "./$types";

  await requireAdmin();

  const { params }: PageProps = $props();

  const category = $derived(await ProductCategoryClient.fromId(params.categoryId as ProductCategoryId));
  const product = $derived(await ProductClient.fromId(params.productId as ProductId));
</script>

<PageWithSidebar>
  <div class="flex h-full">
    <div class="md:flex hidden list-column">
      <div class="flex font-bold justify-between mb-2">
        <h2>Categorie</h2>
        <AddCategoryDialog>
          <PlusIcon class="size-4" />
        </AddCategoryDialog>
      </div>

      <CategoriesList />
    </div>

    <div class="md:flex hidden list-column">
      <div class="font-bold flex justify-between mb-2">
        <h2>Prodotti</h2>
        <AddProductDialog {category}>
          <PlusIcon class="size-4" />
        </AddProductDialog>
      </div>

      <ProductsList {category} />
    </div>

    <div class="flex list-column">
      <div class="font-bold flex mb-2 items-center gap-2">
        <A href="/admin/products/{category.data.id}">
          <ArrowLeftIcon class="size-4 md:hidden" />
        </A>

        <h2 class="flex gap-1">
          <span>Opzioni</span>
          <span class="md:hidden">per {product.data.name}</span>
        </h2>

        <div class="ml-auto">
          <AddProductOptionDialog {product}>
            <PlusIcon class="size-4" />
          </AddProductOptionDialog>
        </div>
      </div>

      <ProductOptionsList {product} />
    </div>
  </div>
</PageWithSidebar>

<style>
  @reference "#assets/tailwind.css";

  .list-column {
    @apply w-full flex-col border-slate-300 p-2 not-first:border-l;
  }
</style>
