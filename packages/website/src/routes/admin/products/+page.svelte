<script lang="ts">
  import Header from "#components/Header.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import CategoriesColumn from "./_components/CategoriesColumn.svelte";
  import ColumnsLayout from "./_components/ColumnsLayout.svelte";
  import EmptyOptionsColumn from "./_components/EmptyOptionsColumn.svelte";
  import EmptyProductsColumn from "./_components/EmptyProductsColumn.svelte";

  await requireAdmin();
</script>

<svelte:head>
  <title>Configurazione menù | Cassa</title>
</svelte:head>

<Header>
  <h1>Configurazione menù</h1>
</Header>

<ColumnsLayout mainColumn="first">
  {#snippet firstColumn()}
    <CategoriesColumn />
  {/snippet}
  {#snippet secondColumn()}
    <EmptyProductsColumn />
  {/snippet}
  {#snippet thirdColumn()}
    <EmptyOptionsColumn />
  {/snippet}
</ColumnsLayout>
