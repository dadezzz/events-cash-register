<script lang="ts">
  import { PencilIcon, PlusIcon, TrashIcon } from "phosphor-svelte";
  import { A, Button } from "#components/controls/index.ts";
  import { Dialog, DialogClose } from "#components/dialog/index.ts";
  import Form from "#components/form/Form.svelte";
  import { HiddenInput, PasswordInput, TextInput } from "#components/form/input/index.ts";
  import { FormatDuration } from "#components/format/index.ts";
  import Pagination from "#components/Pagination.svelte";
  import { Duration } from "#lib/duration.ts";
  import { User } from "#lib/entities/user/client/index.ts";
  import type { PaginationSortColumn } from "#lib/entities/user/pagination.ts";
  import { createUrlForPagination, getCurrentPaginationOptions, invertSortDirection } from "#lib/pagination.ts";
  import { ADMIN_USERS_PAGE_SIZE } from "$app/env/public";
  import { page } from "$app/state";
  import { addUserForm, deleteUserForm } from "./_forms.remote.ts";
  import { addUserFormSchema, paginationSchema } from "./_schemas.ts";

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

{#snippet sortableTH(column: PaginationSortColumn, label: string)}
  <th>
    <A
      href={paginationOptions.sortColumn === column
        ? createUrlForPagination(page.url, { sortDirection: invertSortDirection(paginationOptions.sortDirection) }).href
        : createUrlForPagination<PaginationSortColumn>(page.url, { sortColumn: column }).href}
    >
      {label}
    </A>
  </th>
{/snippet}

<table>
  <thead>
    <tr>
      {@render sortableTH("name", "Nome")}
      {@render sortableTH("username", "Nome utente")}
      {@render sortableTH("createdAt", "Creazione")}
      <th>Permessi</th>
      <th>Azioni</th>
    </tr>
  </thead>
  <tbody>
    {#each users as user (user.data.id)}
      {@const privileges = await user.getPrivilegesAdmin()}

      <tr>
        <td>{user.data.name}</td>
        <td>{user.data.username}</td>
        <td>
          <FormatDuration duration={Duration.fromMilliseconds(Date.now() - user.data.createdAt.getTime())} levels={1} /> fa
        </td>
        <td>{privileges}</td>
        <td>
          <Dialog>
            {#snippet trigger({ props })}
              <Button type="button" {...props} aria-label="Modifica"><PencilIcon class="size-5" /></Button>
            {/snippet}
            {#snippet content({ props })}

            {/snippet}
          </Dialog>
          <Dialog>
            {#snippet trigger({ props })}
              <Button type="button" {...props} aria-label="Elimina"><TrashIcon class="size-5" /></Button>
            {/snippet}
            {#snippet content({ props })}
              <div {...props} class="bg-white fixed z-50 top-1/2 left-1/2 -translate-1/2">
                <h2>Elimina utente</h2>

                <p>Conferma di voler eliminare l'utente {user.data.username}</p>

                <Form form={deleteUserForm}>
                  <HiddenInput field={deleteUserForm.fields.id} value={user.data.id} />

                  <DialogClose type="button">Annulla</DialogClose>
                  <Button type="submit">Conferma</Button>
                </Form>
              </div>
            {/snippet}
          </Dialog>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<Pagination {paginationOptions} pageSize={ADMIN_USERS_PAGE_SIZE} itemsCount={usersCount} />
