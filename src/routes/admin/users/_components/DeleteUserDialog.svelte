<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import { Dialog, DialogClose } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { User } from "#lib/entities/user/client/index.ts";
  import { deleteUserForm } from "../_forms.remote.ts";

  interface Props {
    user: User;
  }

  const { user }: Props = $props();

  const form = $derived(deleteUserForm.for(user.data.id));
  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} aria-label="Elimina">
      <TrashIcon class="size-5" />
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white fixed z-50 top-1/2 left-1/2 -translate-1/2">
      <h2>Elimina utente</h2>

      <p>Conferma di voler eliminare l'utente {user.data.username}</p>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={user.data.id} />

        <DialogClose type="button">Annulla</DialogClose>
        <Button type="submit">Conferma</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>
