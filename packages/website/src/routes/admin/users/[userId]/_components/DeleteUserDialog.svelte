<script lang="ts">
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

  <DialogButton
    class="button-primary-red px-2 py-1 disabled:bg-mist-200 disabled:text-mist-600 dark:disabled:bg-mist-800 dark:disabled:text-mist-400"
  >
    Elimina
  </DialogButton>

  <DialogContent>
    <div class="dialog-center dialog-inner flex flex-col gap-2 p-2" transition:fly>
      <h2 class="text-xl font-semibold">Elimina utente</h2>

      <p>Conferma di voler eliminare l'utente {user.data.username}</p>

      <Form
        {form}
        onresult={() => {
          dialogContext.open = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={user.data.id} />

        <div class="flex justify-end gap-2">
          <DialogButton class="button-secondary px-2 py-1">Annulla</DialogButton>
          <button type="submit" class="button-primary-red px-2 py-1">Conferma</button>
        </div>
      </Form>
    </div>
  </DialogContent>
</DialogRoot>
