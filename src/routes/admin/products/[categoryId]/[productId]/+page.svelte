<script lang="ts">
  import { ArrowLeftIcon } from "phosphor-svelte";
  import Header from "#components/Header.svelte";
  import ThreeColumnsStacked from "#components/ThreeColumnsStacked.svelte";
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

<svelte:head>
  <title>Configurazione menù | Cassa</title>
</svelte:head>

<Header>
  <h1>Configurazione menù</h1>
</Header>

<ThreeColumnsStacked mainColumn="third" columnClass="p-2 h-full flex flex-col">
  {#snippet firstColumn()}
    <div class="mb-2 flex justify-between font-bold">
      <h2>Categorie</h2>
      <AddCategoryDialog />
    </div>

    <CategoriesList />
  {/snippet}
  {#snippet secondColumn()}
    <div class="mb-2 flex justify-between font-bold">
      <h2>Prodotti</h2>
      <AddProductDialog {category} />
    </div>

    <ProductsList {category} />
  {/snippet}
  {#snippet thirdColumn()}
    <div class="mb-2 flex items-center gap-2 font-bold">
      <a href="/admin/products/{category.data.id}" class="md:hidden">
        <ArrowLeftIcon class="size-4" />
      </a>

      <h2 class="flex gap-1 text-nowrap">
        <span>Opzioni</span>
        <span class="md:hidden">per {product.data.name}</span>
      </h2>

      <div class="ml-auto">
        <AddProductOptionDialog {product} />
      </div>
    </div>

    <ProductOptionsList {product} />
  {/snippet}
</ThreeColumnsStacked>
