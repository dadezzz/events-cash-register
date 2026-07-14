<script lang="ts">
  import { ArrowLeftIcon, PlusIcon } from "phosphor-svelte";
  import { A } from "#components/controls/index.ts";
  import PageWithSidebar from "#components/layouts/PageWithSidebar.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import type { ProductCategoryId } from "#lib/entities/products/category/id.ts";
  import AddCategoryDialog from "../_components/add-category-dialog/AddCategoryDialog.svelte";
  import AddProductDialog from "../_components/add-product-dialog/AddProductDialog.svelte";
  import CategoriesList from "../_components/lists/CategoriesList.svelte";
  import ProductsList from "../_components/lists/ProductsList.svelte";
  import type { PageProps } from "./$types";

  await requireAdmin();

  const { params }: PageProps = $props();

  const category = $derived(await ProductCategoryClient.fromId(params.categoryId as ProductCategoryId));
</script>

<PageWithSidebar>
  <div class="flex h-full">
    <div class="border-r hidden md:block border-slate-300 w-full p-2">
      <div class="flex font-bold justify-between mb-2">
        <h2>Categorie</h2>
        <AddCategoryDialog>
          <PlusIcon class="size-4" />
        </AddCategoryDialog>
      </div>

      <CategoriesList />
    </div>

    <div class=" w-full p-2">
      <div class="font-bold flex mb-2 items-center gap-2">
        <A href="/admin/products">
          <ArrowLeftIcon class="size-4 md:hidden" />
        </A>

        <h2 class="flex gap-1">
          <span>Prodotti</span>
          <span class="md:hidden">per {category.data.name}</span>
        </h2>

        <div class="ml-auto">
          <AddProductDialog {category}>
            <PlusIcon class="size-4" />
          </AddProductDialog>
        </div>
      </div>

      <ProductsList {category} />
    </div>

    <div class="md:block border-l border-slate-300 hidden w-full p-2">
      <h2 class="font-bold">Opzioni</h2>

      <div class="flex h-full items-center justify-center">
        <p>Seleziona un prodotto</p>
      </div>
    </div>
  </div>
</PageWithSidebar>
