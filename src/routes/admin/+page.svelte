<script lang="ts">
  import { requireAdmin } from "#lib/auth/index.remote.ts";

  await requireAdmin();
</script>
