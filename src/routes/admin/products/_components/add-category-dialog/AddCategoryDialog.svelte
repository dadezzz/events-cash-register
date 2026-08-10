<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import AddCategoryForm from "./AddCategoryForm.svelte";

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button {...props} type="button" class="button-ghost p-1 text-mist-700 dark:text-mist-300">
      <PlusIcon class="size-4" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inner p-2" transition:fly>
      <h2 class="mb-2 text-xl font-bold">Aggiungi categoria</h2>

      <p class="mb-2">Una categoria definisce un gruppo di prodotti visualizzati insieme</p>

      <AddCategoryForm
        onresult={() => {
          dialogOpen = false;
        }}
        oncancel={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
