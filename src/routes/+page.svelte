<script lang="ts">
  import { requireUser } from "#lib/auth/index.remote.ts";
  import { goto } from "$app/navigation";

  await requireUser();
  await goto("/products");
</script>
