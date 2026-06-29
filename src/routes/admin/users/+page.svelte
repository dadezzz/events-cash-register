<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import { Dialog } from "#components/dialog/index.ts";
  import Form from "#components/form/Form.svelte";
  import { PasswordInput, TextInput } from "#components/form/input/index.ts";
  import { FormatDuration } from "#components/format/index.ts";
  import Pagination from "#components/navigation/Pagination.svelte";
  import { Table, TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow } from "#components/table/index.ts";
  import { Duration } from "#lib/duration.ts";
  import { User } from "#lib/entities/user/client/index.ts";
  import { paginationSchema } from "#lib/entities/user/pagination.ts";
  import { getCurrentPaginationOptions } from "#lib/pagination.ts";
  import { ADMIN_USERS_PAGE_SIZE } from "$app/env/public";
  import { page } from "$app/state";
  import DeleteUserButton from "./_components/DeleteUserButton.svelte";
  import UpdateUserButton from "./_components/UpdateUserButton.svelte";
  import { addUserForm } from "./_forms.remote.ts";
  import { addUserFormSchema } from "./_schemas.ts";

  const paginationOptions = $derived(getCurrentPaginationOptions(paginationSchema, page.url));
  const users = $derived(await User.getAllAdmin(paginationOptions));
  const usersCount = $derived(await User.countAllAdmin());

  let addUserDialogOpen = $state(false);
</script>

<Dialog bind:open={addUserDialogOpen}>
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
        form={addUserForm.preflight(addUserFormSchema)}
        onresult={() => {
          addUserDialogOpen = false;
        }}
      >
        <TextInput field={addUserForm.fields.name} label="Nome" />
        <TextInput field={addUserForm.fields.username} label="Nome utente (usato per l'accesso)" />
        <PasswordInput field={addUserForm.fields._password} label="Password" />

        <Button type="submit">Crea</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>

<Table>
  {#snippet head()}
    <TableHeadRow>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "name" }}>Nome</TableHeadCell>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "username" }}>Nome utente</TableHeadCell>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "createdAt" }}>Creato</TableHeadCell>
      <TableHeadCell>Permessi</TableHeadCell>
      <TableHeadCell>Azioni</TableHeadCell>
    </TableHeadRow>
  {/snippet}

  {#snippet body()}
    {#each users as user (user.data.id)}
      {@const privileges = await user.getPrivilegesAdmin()}

      <TableBodyRow>
        <TableBodyCell>{user.data.name}</TableBodyCell>
        <TableBodyCell>{user.data.username}</TableBodyCell>

        <TableBodyCell>
          <FormatDuration duration={Duration.fromMilliseconds(Date.now() - user.data.createdAt.getTime())} levels={1} /> fa
        </TableBodyCell>

        <TableBodyCell>{privileges}</TableBodyCell>

        <TableBodyCell>
          <UpdateUserButton {user} />
          <DeleteUserButton {user} />
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  {/snippet}
</Table>

<Pagination {paginationOptions} pageSize={ADMIN_USERS_PAGE_SIZE} itemsCount={usersCount} />
