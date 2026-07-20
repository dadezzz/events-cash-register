<script lang="ts">
  import { ArrowLeftIcon } from "phosphor-svelte";
  import Header from "#components/Header.svelte";
  import ThreeColumnsStacked from "#components/ThreeColumnsStacked.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import type { ProductCategoryId } from "#lib/entities/products/category/id.ts";
  import AddCategoryDialog from "../_components/add-category-dialog/AddCategoryDialog.svelte";
  import CategoriesList from "../_components/CategoriesList.svelte";
  import AddProductDialog from "./_components/add-product-dialog/AddProductDialog.svelte";
  import ProductsList from "./_components/ProductsList.svelte";
  import type { PageProps } from "./$types";

  await requireAdmin();

  const { params }: PageProps = $props();

  const category = $derived(await ProductCategoryClient.fromId(params.categoryId as ProductCategoryId));
</script>

<svelte:head>
  <title>Configurazione menù | Cassa</title>
</svelte:head>

<Header>
  <h1>Configurazione menù</h1>
</Header>

<ThreeColumnsStacked mainColumn="second" columnClass="p-2 h-full flex flex-col">
  {#snippet firstColumn()}
    <div class="mb-2 flex justify-between font-bold">
      <h2>Categorie</h2>
      <AddCategoryDialog />
    </div>

    <CategoriesList />
  {/snippet}
  {#snippet secondColumn()}
    <div class="mb-2 flex items-center gap-2 font-bold">
      <a href="/admin/products" class="md:hidden">
        <ArrowLeftIcon class="size-4" />
      </a>

      <h2 class="flex gap-1 text-nowrap">
        <span>Prodotti</span>
        <span class="md:hidden">per {category.data.name}</span>
      </h2>

      <div class="ml-auto">
        <AddProductDialog {category} />
      </div>
    </div>

    <ProductsList {category} />
  {/snippet}
  {#snippet thirdColumn()}
    <h2 class="font-bold">Opzioni</h2>

    <div class="flex h-full items-center justify-center">
      <p>Seleziona un prodotto</p>
    </div>
  {/snippet}
</ThreeColumnsStacked>
