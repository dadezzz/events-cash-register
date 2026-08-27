<script lang="ts">
  import { UserClient } from "#lib/entities/user/client/index.ts";
  import { userPaginationSchema } from "#lib/entities/user/pagination.ts";
  import { createPaginationUrl, getCurrentPaginationOptions } from "#lib/pagination.ts";
  import { page } from "$app/state";
  import AddUserDialog from "./AddUserDialog.svelte";

  // Use a number high enough that we won't need pagination. It is used only for
  // sorting.
  const pageSize = Number.MAX_SAFE_INTEGER;
  const paginationOptions = $derived(getCurrentPaginationOptions(userPaginationSchema, pageSize, page.url));
  const users = $derived(await UserClient.fromPaginationAdmin(paginationOptions));
</script>

<div class="border-mist-default flex justify-between border-b p-2 font-bold">
  <h2>Utenti</h2>
  <AddUserDialog />
</div>

<ol class="flex flex-col gap-2 overflow-y-auto p-2">
  {#each users as user (user.data.id)}
    <li>
      <a
        href={createPaginationUrl(new URL(`/admin/users/${user.data.id}`, page.url), paginationOptions).href}
        aria-current={page.url.pathname.startsWith(`/admin/users/${user.data.id}`)}
        class="outline-emerald-default flex w-full items-center gap-2 rounded-md p-2 hover:bg-mist-200 focus:bg-emerald-50 focus:outline-none not-focus:aria-current:bg-mist-100 dark:hover:bg-mist-800 dark:focus:bg-emerald-950 not-focus:dark:aria-current:bg-mist-900"
      >
        <span>{user.data.name}</span>
        <span class="text-mist-600 dark:text-mist-400">({user.data.username})</span>
      </a>
    </li>
  {/each}
</ol>
