<script lang="ts">
  import { FormatDuration } from "#components/format/index.ts";
  import Pagination from "#components/navigation/Pagination.svelte";
  import { Table, TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow } from "#components/table/index.ts";
  import { Duration } from "#lib/duration.ts";
  import { User } from "#lib/entities/user/client/index.ts";
  import { paginationSchema } from "#lib/entities/user/pagination.ts";
  import { getCurrentPaginationOptions } from "#lib/pagination.ts";
  import { ADMIN_USERS_PAGE_SIZE } from "$app/env/public";
  import { page } from "$app/state";
  import AddUserDialog from "./_components/AddUserDialog.svelte";
  import DeleteUserDialog from "./_components/DeleteUserDialog.svelte";
  import UpdateUserDialog from "./_components/UpdateUserDialog.svelte";

  const paginationOptions = $derived(getCurrentPaginationOptions(paginationSchema, page.url));
  const users = $derived(await User.getAllAdmin(paginationOptions));
  const usersCount = $derived(await User.countAllAdmin());
</script>

<AddUserDialog />

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
          <FormatDuration duration={Duration.fromMilliseconds(Date.now() - user.data.createdAt.getTime())} /> fa
        </TableBodyCell>

        <TableBodyCell>{privileges}</TableBodyCell>

        <TableBodyCell>
          <UpdateUserDialog {user} />
          <DeleteUserDialog {user} />
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  {/snippet}
</Table>

<Pagination {paginationOptions} pageSize={ADMIN_USERS_PAGE_SIZE} itemsCount={usersCount} />
