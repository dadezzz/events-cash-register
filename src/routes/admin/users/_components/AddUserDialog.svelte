<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import { Dialog } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { PasswordInput, TextInput } from "#components/form/input/index.ts";
  import { addUserForm } from "../_forms.remote.ts";
  import { addUserFormSchema } from "../_schemas.ts";

  const form = addUserForm.preflight(addUserFormSchema);
  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} class="font-bold bg-black text-white flex items-center gap-2 p-1 px-3 rounded-md">
      <PlusIcon class="size-5" />
      <span>Nuovo</span>
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="fixed top-1/2 bg-white left-1/2 z-50 -translate-1/2">
      <h2>Aggiungi utente</h2>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <TextInput field={form.fields.name} label="Nome" />
        <TextInput field={form.fields.username} label="Nome utente (usato per l'accesso)" />
        <PasswordInput field={form.fields._password} label="Password" />

        <Button type="submit">Crea</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>
