<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<tr class="border-b border-slate-300 font-semibold text-slate-600">
  {@render children()}
</tr>
