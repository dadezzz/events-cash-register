<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { HiddenInput, PasswordInput, TextInput } from "#components/form/input/index.ts";
  import type { UserClient } from "#lib/entities/user/client/index.ts";
  import { updateUserForm } from "../_forms.remote.ts";
  import { updateUserFormSchema } from "../_schemas.ts";

  interface Props {
    user: UserClient;
  }

  const { user }: Props = $props();

  const form = $derived(updateUserForm.preflight(updateUserFormSchema));
</script>

<Form {form} class="flex flex-col gap-2">
  <HiddenInput field={form.fields.id} value={user.data.id} />
  <TextInput field={form.fields.name} label="Nome" value={user.data.name} />
  <TextInput field={form.fields.username} label="Nome utente (usato per l'accesso)" value={user.data.username} />
  <PasswordInput field={form.fields._password} label="Password" />

  <button type="submit" class="button-primary mt-2 px-2 py-1">Salva</button>
</Form>
