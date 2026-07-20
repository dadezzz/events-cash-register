<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  type ColumnId = "first" | "second" | "third";

  interface Props {
    mainColumn: ColumnId;
    columnClass?: ClassValue;
    firstColumn: Snippet;
    secondColumn: Snippet;
    thirdColumn: Snippet;
  }

  const { mainColumn, columnClass, firstColumn, secondColumn, thirdColumn }: Props = $props();
</script>

{#snippet column(id: ColumnId, children: Snippet)}
  {#if id === mainColumn}
    <div class={["border-mist-default h-full w-full not-first:border-l", columnClass]}>{@render children()}</div>
  {:else}
    <div class={["border-mist-default h-full w-full not-first:border-l max-md:hidden", columnClass]}>
      {@render children()}
    </div>
  {/if}
{/snippet}

<div class="flex h-full">
  {@render column("first", firstColumn)}
  {@render column("second", secondColumn)}
  {@render column("third", thirdColumn)}
</div>
