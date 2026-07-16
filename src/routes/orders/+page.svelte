<script lang="ts">
  import Header from "#components/Header.svelte";
  import { requireUser } from "#lib/auth/index.remote.ts";

  await requireUser();
</script>

<Header />
TODO: show orders and allow reprinting
