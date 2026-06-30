<script lang="ts">
  import { PencilIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import { Dialog } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput, PasswordInput, TextInput } from "#components/form/input/index.ts";
  import type { User } from "#lib/entities/user/client/index.ts";
  import { updateUserForm } from "../_forms.remote.ts";
  import { updateUserFormSchema } from "../_schemas.ts";

  interface Props {
    user: User;
  }

  const { user }: Props = $props();

  const form = $derived(updateUserForm.for(user.data.id).preflight(updateUserFormSchema));
  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} aria-label="Modifica">
      <PencilIcon class="size-5" />
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white fixed z-50 top-1/2 left-1/2 -translate-1/2">
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

        <Button type="submit">Modifica</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>
