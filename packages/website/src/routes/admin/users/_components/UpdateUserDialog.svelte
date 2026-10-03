<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
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
</script>

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <DialogButton aria-label="Modifica">
    <PencilIcon class="size-5" />
  </DialogButton>

  <DialogContent>
    <div class="dialog-center dialog-inner" transition:fly>
      <h2>Modifica utente</h2>

      <Form
        {form}
        onresult={() => {
          dialogContext.open = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={user.data.id} />
        <TextInput field={form.fields.name} label="Nome" value={user.data.name} />
        <TextInput field={form.fields.username} label="Nome utente (usato per l'accesso)" value={user.data.username} />
        <PasswordInput field={form.fields._password} label="Password" />

        <DialogButton>Annulla</DialogButton>
        <button type="submit">Modifica</button>
      </Form>
    </div>
  </DialogContent>
</DialogRoot>
