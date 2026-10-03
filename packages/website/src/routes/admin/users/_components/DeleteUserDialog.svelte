<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { UserClient } from "#lib/entities/user/client/index.ts";
  import { deleteUserForm } from "../_forms.remote.ts";

  interface Props {
    user: UserClient;
  }

  const { user }: Props = $props();

  const form = $derived(deleteUserForm.for(user.data.id));
</script>

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <DialogButton aria-label="Elimina">
    <TrashIcon class="size-5" />
  </DialogButton>

  <DialogContent>
    <div class="dialog-center dialog-inner" transition:fly>
      <h2>Elimina utente</h2>

      <p>Conferma di voler eliminare l'utente {user.data.username}</p>

      <Form
        {form}
        onresult={() => {
          dialogContext.open = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={user.data.id} />

        <DialogButton>Annulla</DialogButton>
        <button type="submit">Conferma</button>
      </Form>
    </div>
  </DialogContent>
</DialogRoot>
