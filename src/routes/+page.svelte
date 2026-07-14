<script lang="ts">
  import PageWithSidebar from "#components/layouts/PageWithSidebar.svelte";
  import { getUserId } from "#lib/auth/index.remote.ts";

  await getUserId();
</script>

<PageWithSidebar>hello</PageWithSidebar>
