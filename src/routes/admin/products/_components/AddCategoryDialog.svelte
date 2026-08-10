<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { TextInput } from "#components/form/input/index.ts";
  import { addCategoryForm } from "../_forms.remote.ts";
  import { addCategorySchema } from "../_schemas.ts";

  let dialogOpen = $state(false);

  const form = addCategoryForm.preflight(addCategorySchema);
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

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
        class="flex flex-col gap-2"
      >
        <TextInput field={form.fields.name} label="Nome" />

        <div class="mt-2 flex justify-end gap-2">
          <button
            type="button"
            class="button-secondary px-2 py-1"
            onclick={() => {
              dialogOpen = false;
            }}
          >
            Annulla
          </button>
          <button type="submit" class="button-primary px-2 py-1">Crea</button>
        </div>
      </Form>
    </div>
  {/snippet}
</Dialog>
