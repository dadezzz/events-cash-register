<script lang="ts">
  import Pagination from "#components/Pagination.svelte";
  import { User } from "#lib/entities/user/client/index.ts";
  import { getCurrentPage } from "#lib/pagination.ts";
  import { ADMIN_USERS_PAGE_SIZE } from "$app/env/public";
  import { page } from "$app/state";

  const users = await User.getAllAdmin(getCurrentPage(page.url));
  const usersCount = await User.countAllAdmin();
</script>

<ul>
  {#each users as user (user.data.id)}
    <li>{user.data.username}</li>
  {/each}
</ul>

<Pagination pageSize={ADMIN_USERS_PAGE_SIZE} itemsCount={usersCount} />
