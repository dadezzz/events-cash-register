<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { UserClient } from "#lib/entities/user/client/index.ts";
  import { deleteUserForm } from "../_forms.remote.ts";

  interface Props {
    user: UserClient;
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
    <div {...props} class="bg-white dialog-centered">
      <h2>Elimina utente</h2>

      <p>Conferma di voler eliminare l'utente {user.data.username}</p>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={user.data.id} />

        <Button
          type="button"
          onclick={() => {
            dialogOpen = false;
          }}
        >
          Annulla
        </Button>
        <Button type="submit">Conferma</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>
