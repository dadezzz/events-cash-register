<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    color: keyof typeof colors;
  }

  const { color, children }: Props = $props();

  const colors = {
    error: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  };
</script>

<div class={["w-fit rounded-full px-2 py-1 text-xs font-semibold", colors[color]]}>
  {@render children()}
</div>
