<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, HiddenInput } from "#components/form/input/index.ts";
  import type { UserClient } from "#lib/entities/user/client/index.ts";
  import { type UserPrivilege, userPrivilegesMetadata } from "#lib/entities/user/privilege.ts";
  import { updateUserPrivilegesForm } from "../_forms.remote.ts";
  import { updateUserPrivilegeFormSchema } from "../_schemas.ts";

  interface Props {
    user: UserClient;
  }

  const { user }: Props = $props();

  const userPrivileges = $derived(await user.getPrivilegesAdmin());

  const form = $derived(updateUserPrivilegesForm.preflight(updateUserPrivilegeFormSchema));
</script>

<Form {form} class="flex flex-col gap-2">
  <HiddenInput field={form.fields.id} value={user.data.id} />

  <ul>
    {#each Object.entries(userPrivilegesMetadata) as [name, meta], i (name)}
      <li>
        <HiddenInput field={form.fields.privileges[i].name} value={name} />

        <CheckboxInput
          label={meta.readableName}
          field={form.fields.privileges[i].granted}
          checked={userPrivileges.includes(name as UserPrivilege)}
        />
      </li>
    {/each}
  </ul>

  <button type="submit" class="button-primary mt-2 px-2 py-1">Salva</button>
</Form>
