<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  type ColumnId = "first" | "second";

  interface Props {
    mainColumn: ColumnId;
    firstColumn: Snippet;
    secondColumn: Snippet;
  }

  const { mainColumn, firstColumn, secondColumn }: Props = $props();
</script>

{#snippet column(
  id: ColumnId,
  className: ClassValue,
  children: Snippet,
)}
  {#if id === mainColumn}
    <div class={["border-mist-default flex h-full w-full flex-col not-first:border-l", className]}>
      {@render children()}
    </div>
  {:else}
    <div class={["border-mist-default flex h-full w-full flex-col not-first:border-l max-lg:hidden", className]}>
      {@render children()}
    </div>
  {/if}
{/snippet}

<div class="flex h-full min-h-0">
  {@render column("first", "lg:w-1/4", firstColumn)}
  {@render column("second", "lg:w-3/4", secondColumn)}
</div>
