<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    head: Snippet;
    body: Snippet;
  }

  const { head, body }: Props = $props();
</script>

<table>
  <thead>
    {@render head()}
  </thead>
  <tbody>
    {@render body()}
  </tbody>
</table>
