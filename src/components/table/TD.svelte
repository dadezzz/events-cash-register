<script lang="ts">
  import type { Snippet } from "svelte";
  import TC from "./TC.svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<td>
  <TC>
    {@render children()}
  </TC>
</td>
