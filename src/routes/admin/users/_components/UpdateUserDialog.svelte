<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput, PasswordInput, TextInput } from "#components/form/input/index.ts";
  import type { UserClient } from "#lib/entities/user/client/index.ts";
  import { updateUserForm } from "../_forms.remote.ts";
  import { updateUserFormSchema } from "../_schemas.ts";

  interface Props {
    user: UserClient;
  }

  const { user }: Props = $props();

  const form = $derived(updateUserForm.for(user.data.id).preflight(updateUserFormSchema));
  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button type="button" {...props} aria-label="Modifica">
      <PencilIcon class="size-5" />
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-default">
      <h2>Modifica utente</h2>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={user.data.id} />
        <TextInput field={form.fields.name} label="Nome" value={user.data.name} />
        <TextInput field={form.fields.username} label="Nome utente (usato per l'accesso)" value={user.data.username} />
        <PasswordInput field={form.fields._password} label="Password" />

        <button type="submit">Modifica</button>
      </Form>
    </div>
  {/snippet}
</Dialog>
