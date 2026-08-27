<script lang="ts">
  import Header from "#components/Header.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import type { ProductCategoryId } from "#lib/entities/products/category/id.ts";
  import CategoriesColumn from "../_components/CategoriesColumn.svelte";
  import ColumnsLayout from "../_components/ColumnsLayout.svelte";
  import EmptyOptionsColumn from "../_components/EmptyOptionsColumn.svelte";
  import ProductsColumn from "./_components/ProductsColumn.svelte";
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

<ColumnsLayout mainColumn="second">
  {#snippet firstColumn()}
    <CategoriesColumn />
  {/snippet}
  {#snippet secondColumn()}
    <ProductsColumn {category} />
  {/snippet}
  {#snippet thirdColumn()}
    <EmptyOptionsColumn />
  {/snippet}
</ColumnsLayout>
