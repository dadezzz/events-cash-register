<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { TextInput } from "#components/form/input/index.ts";
  import { addCategoryForm } from "../_forms.remote.ts";
  import { addCategorySchema } from "../_schemas.ts";

  const form = addCategoryForm.preflight(addCategorySchema);
</script>

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <DialogButton class="button-ghost p-1 text-mist-700 dark:text-mist-300">
    <PlusIcon class="size-4" />
  </DialogButton>

  <DialogContent>
    <div class="dialog-center dialog-inner p-2" transition:fly>
      <h2 class="mb-2 text-xl font-bold">Aggiungi categoria</h2>

      <p class="mb-2">Una categoria definisce un gruppo di prodotti visualizzati insieme</p>

      <Form
        {form}
        class="flex flex-col gap-2"
        onresult={() => {
          dialogContext.open = false;
        }}
      >
        <TextInput field={form.fields.name} label="Nome" />

        <div class="mt-2 flex justify-end gap-2">
          <DialogButton class="button-secondary px-2 py-1">Annulla</DialogButton>
          <button type="submit" class="button-primary px-2 py-1">Crea</button>
        </div>
      </Form>
    </div>
  </DialogContent>
</DialogRoot>
