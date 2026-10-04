<script lang="ts">
  import Header from "#components/Header.svelte";
  import { requireUser } from "#lib/auth/index.remote.ts";
  import CategoriesList from "./_components/CategoriesList.svelte";
  import EmptyProductsColumn from "./_components/EmptyProductsColumn.svelte";
  import OrderColumnRoot from "./_components/OrderColumnRoot.svelte";

  await requireUser();
</script>

<Header />

<div class="flex min-h-0 grow flex-col md:flex-row">
  <div class="page-section p-1">
    <h2 class="p-1 font-semibold">Categorie</h2>

    <CategoriesList />
  </div>

  <EmptyProductsColumn />

  <div class="page-section">
    <OrderColumnRoot />
  </div>
</div>

<style>
  @reference "#assets/tailwind.css";

  .page-section {
    @apply border-mist-default not-md:not-first:border-t md:not-first:border-l;
  }
</style>
