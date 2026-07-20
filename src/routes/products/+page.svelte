<script lang="ts">
  import Header from "#components/Header.svelte";
  import { requireUser } from "#lib/auth/index.remote.ts";
  import CategoriesList from "./_components/CategoriesList.svelte";
  import OrderList from "./_components/OrderList.svelte";

  await requireUser();
</script>

<Header />

<div class="flex min-h-0 grow flex-col md:flex-row">
  <div class="page-section p-1">
    <h2 class="p-1 font-semibold">Categorie</h2>

    <CategoriesList />
  </div>

  <div class="page-section w-full">
    <h2 class="p-2 font-semibold">Prodotti</h2>

    <div class="flex h-full items-center justify-center">
      <p class="text-mist-600 dark:text-mist-400">Seleziona una categoria</p>
    </div>
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
