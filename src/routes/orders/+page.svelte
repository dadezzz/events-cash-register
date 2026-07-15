<script lang="ts">
  import PageWithSidebar from "#components/layouts/PageWithSidebar.svelte";
  import { requireUser } from "#lib/auth/index.remote.ts";

  await requireUser();
</script>

<PageWithSidebar>TODO: show orders and allow reprinting</PageWithSidebar>
