<script lang="ts">
  import { FormatDuration } from "#components/format/index.ts";
  import Header from "#components/Header.svelte";
  import Pagination from "#components/navigation/Pagination.svelte";
  import { Table, TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow } from "#components/table/index.ts";
  import { Duration } from "#lib/duration.ts";
  import { UserClient } from "#lib/entities/user/client/index.ts";
  import { userPaginationSchema } from "#lib/entities/user/pagination.ts";
  import { getCurrentPaginationOptions } from "#lib/pagination.ts";
  import { page } from "$app/state";
  import AddUserDialog from "./_components/AddUserDialog.svelte";
  import DeleteUserDialog from "./_components/DeleteUserDialog.svelte";
  import UpdateUserDialog from "./_components/UpdateUserDialog.svelte";

  const pageSize = 10;
  const paginationOptions = $derived(getCurrentPaginationOptions(userPaginationSchema, pageSize, page.url));
  const users = $derived(await UserClient.fromPaginationAdmin(paginationOptions));
  const usersCount = $derived(await UserClient.countAllAdmin());
</script>

<Header />

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
          <FormatDuration duration={Duration.fromDate(user.data.createdAt)} />
          fa
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

<Pagination options={paginationOptions} itemsCount={usersCount} />
