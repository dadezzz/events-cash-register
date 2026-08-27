<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { PasswordInput, TextInput } from "#components/form/input/index.ts";
  import { addUserForm } from "../_forms.remote.ts";
  import { addUserFormSchema } from "../_schemas.ts";

  let dialogOpen = $state(false);
  const form = addUserForm.preflight(addUserFormSchema);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button {...props} type="button" class="button-ghost p-1 text-mist-700 dark:text-mist-300">
      <PlusIcon class="size-4" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inner p-2" transition:fly>
      <h2 class="mb-2 text-xl font-bold">Aggiungi utente</h2>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
        class="flex flex-col gap-2"
      >
        <TextInput field={form.fields.name} label="Nome" />
        <TextInput field={form.fields.username} label="Nome utente (usato per l'accesso)" />
        <PasswordInput field={form.fields._password} label="Password" />

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
