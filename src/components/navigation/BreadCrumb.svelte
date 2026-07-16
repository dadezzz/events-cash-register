<script lang="ts">
  import { CaretRightIcon, HouseIcon } from "phosphor-svelte";
  import Navigation from "./Navigation.svelte";

  interface Props {
    entries: { label: string; href: string }[];
  }

  const { entries }: Props = $props();
</script>

<Navigation {entries} class="m-1 flex w-full items-center gap-2 text-sm text-slate-400">
  {#snippet entryUI({ label })}
    <div class="flex items-center gap-2">
      <CaretRightIcon class="size-4 text-slate-400" />

      <span
        class="block rounded-full border border-transparent p-2 outline-yellow-200 group-focus:outline-2 hover:border-yellow-300 hover:bg-yellow-50"
      >
        {label}
      </span>
    </div>
  {/snippet}
  {#snippet entriesUI({ entries, wrappedEntryUI })}
    <li>
      <a
        aria-label="Ritorna alla pagina Home"
        href="/"
        class="block rounded-full border border-transparent p-2 outline-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 focus:outline-2"
      >
        <HouseIcon class="size-4" />
      </a>
    </li>

    {#each entries as entry (entry.href)}
      {@render wrappedEntryUI(entry)}
    {/each}
  {/snippet}
</Navigation>
