<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<tr class="border-b border-slate-200">
  {@render children()}
</tr>
