<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    color: keyof typeof colors;
  }

  const { color, children }: Props = $props();

  const colors = {
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
  };
</script>

<div class={["w-fit rounded-full px-2 py-1 text-xs font-semibold", colors[color]]}>
  {@render children()}
</div>
