<script lang="ts">
  import type { Snippet } from "svelte";
  import TC from "./TC.svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<th>
  <TC>
    {@render children()}
  </TC>
</th>
