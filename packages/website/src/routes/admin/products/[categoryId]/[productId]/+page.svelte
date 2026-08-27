<script lang="ts">
  import Header from "#components/Header.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import type { ProductCategoryId } from "#lib/entities/products/category/id.ts";
  import { ProductClient } from "#lib/entities/products/client/index.ts";
  import type { ProductId } from "#lib/entities/products/id.ts";
  import CategoriesColumn from "../../_components/CategoriesColumn.svelte";
  import ColumnsLayout from "../../_components/ColumnsLayout.svelte";
  import ProductsColumn from "../_components/ProductsColumn.svelte";
  import OptionsColumn from "./_components/OptionsColumn.svelte";
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

<ColumnsLayout mainColumn="third">
  {#snippet firstColumn()}
    <CategoriesColumn />
  {/snippet}
  {#snippet secondColumn()}
    <ProductsColumn {category} />
  {/snippet}
  {#snippet thirdColumn()}
    <OptionsColumn {category} {product} />
  {/snippet}
</ColumnsLayout>
