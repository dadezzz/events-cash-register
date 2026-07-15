<script lang="ts">
  import { requireUser } from "#lib/auth/index.remote.ts";

  await requireUser();
</script>
