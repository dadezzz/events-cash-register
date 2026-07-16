<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import Header from "#components/Header.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import AddCategoryDialog from "./_components/add-category-dialog/AddCategoryDialog.svelte";
  import CategoriesList from "./_components/CategoriesList.svelte";

  await requireAdmin();
</script>

<Header />

<div class="flex h-full">
  <div class="flex list-column">
    <div class="font-bold flex justify-between mb-2">
      <h2>Categorie</h2>
      <AddCategoryDialog>
        <PlusIcon class="size-4" />
      </AddCategoryDialog>
    </div>

    <CategoriesList />
  </div>

  <div class="md:flex hidden list-column">
    <h2 class="font-bold">Prodotti</h2>

    <div class="flex grow items-center justify-center">
      <p>Seleziona una categoria</p>
    </div>
  </div>

  <div class="md:flex hidden list-column">
    <h2 class="font-bold">Opzioni</h2>

    <div class="flex grow items-center justify-center">
      <p>Seleziona un prodotto</p>
    </div>
  </div>
</div>

<style>
  @reference "#assets/tailwind.css";

  .list-column {
    @apply w-full flex-col border-slate-300 p-2 not-first:border-l;
  }
</style>
