<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import PageWithSidebar from "#components/layouts/PageWithSidebar.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import AddCategoryDialog from "./_components/add-category-dialog/AddCategoryDialog.svelte";
  import CategoriesList from "./_components/lists/CategoriesList.svelte";

  await requireAdmin();
</script>

<PageWithSidebar>
  <div class="flex h-full">
    <div class="w-full p-2">
      <div class="font-bold flex mb-2">
        <h2>Categorie</h2>

        <div class="ml-auto">
          <AddCategoryDialog>
            <PlusIcon class="size-4" />
          </AddCategoryDialog>
        </div>
      </div>

      <CategoriesList />
    </div>

    <div class="md:block border-l border-slate-300 hidden w-full p-2">
      <h2 class="font-bold">Prodotti</h2>

      <div class="flex h-full items-center justify-center">
        <p>Seleziona una categoria</p>
      </div>
    </div>

    <div class="md:block border-l border-slate-300 hidden w-full p-2">
      <h2 class="font-bold">Opzioni</h2>

      <div class="flex h-full items-center justify-center">
        <p>Seleziona un prodotto</p>
      </div>
    </div>
  </div>
</PageWithSidebar>
