<script lang="ts">
  import { requireAuthenticated } from "#lib/auth/index.remote.ts";

  await requireAuthenticated();
</script>
