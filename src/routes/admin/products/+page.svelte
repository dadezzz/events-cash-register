<script lang="ts">
  import Header from "#components/Header.svelte";
  import ThreeColumnsStacked from "#components/ThreeColumnsStacked.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import AddCategoryDialog from "./_components/add-category-dialog/AddCategoryDialog.svelte";
  import CategoriesList from "./_components/CategoriesList.svelte";

  await requireAdmin();
</script>

<svelte:head>
  <title>Configurazione menù | Cassa</title>
</svelte:head>

<Header>
  <h1>Configurazione menù</h1>
</Header>

<ThreeColumnsStacked mainColumn="first" columnClass="p-2 h-full flex flex-col">
  {#snippet firstColumn()}
    <div class="mb-2 flex justify-between font-bold">
      <h2>Categorie</h2>
      <AddCategoryDialog />
    </div>

    <CategoriesList />
  {/snippet}
  {#snippet secondColumn()}
    <h2 class="font-bold">Prodotti</h2>

    <div class="flex grow items-center justify-center">
      <p>Seleziona una categoria</p>
    </div>
  {/snippet}
  {#snippet thirdColumn()}
    <h2 class="font-bold">Opzioni</h2>

    <div class="flex grow items-center justify-center">
      <p>Seleziona un prodotto</p>
    </div>
  {/snippet}
</ThreeColumnsStacked>
