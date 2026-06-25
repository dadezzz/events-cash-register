<script lang="ts" module>
  interface Entry<T> {
    href: string;
    label: T;
  }

  export interface NavigationProps<T> extends HTMLAttributes<HTMLElement> {
    entries: Entry<T>[];
    entryUI: Snippet<[Entry<T>]>;
    entriesUI?: Snippet<[{ wrappedEntryUI: Snippet<[Entry<T>]>; entries: Entry<T>[] }]>;
  }
</script>

<script lang="ts" generics="T">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { A } from "#components/controls/index.ts";

  const { entryUI, entriesUI, entries, ...rest }: NavigationProps<T> = $props();
</script>

{#snippet wrappedEntryUI(entry: Entry<T>)}
  <li>
    <A href={entry.href} class="group focus:outline-none">
      {@render entryUI(entry)}
    </A>
  </li>
{/snippet}

<nav {...rest}>
  <ul class="contents">
    {#if entriesUI}
      {@render entriesUI({ wrappedEntryUI, entries })}
    {:else}
      {#each entries as entry (entry.href)}
        {@render wrappedEntryUI(entry)}
      {/each}
    {/if}
  </ul>
</nav>
