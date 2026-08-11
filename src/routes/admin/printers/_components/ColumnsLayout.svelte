<script lang="ts">
  import type { Snippet } from "svelte";

  type ColumnId = "first" | "second";

  interface Props {
    mainColumn: ColumnId;
    firstColumn: Snippet;
    secondColumn: Snippet;
  }

  const { mainColumn, firstColumn, secondColumn }: Props = $props();
</script>

{#snippet column(id: ColumnId, children: Snippet)}
  {#if id === mainColumn}
    <div class="border-mist-default flex h-full w-full flex-col not-first:border-l">{@render children()}</div>
  {:else}
    <div class="border-mist-default flex h-full w-full flex-col not-first:border-l max-md:hidden">
      {@render children()}
    </div>
  {/if}
{/snippet}

<div class="flex h-full min-h-0">
  {@render column("first", firstColumn)}
  {@render column("second", secondColumn)}
</div>
