<script lang="ts">
  import type { RemoteFormFields } from "@sveltejs/kit";
  import { fly } from "svelte/transition";
  import {
    getPopoverContext,
    PopoverAnchor,
    PopoverButton,
    PopoverContent,
    PopoverRoot,
  } from "#components/popover/index.ts";
  import Separator from "#components/Separator.svelte";
  import type { BlockData } from "#lib/entities/printer/receipt-template/schema.ts";

  interface Props {
    blocksField: RemoteFormFields<BlockData[]>;
    position: number;
    choices: { value: string; label: string }[];
  }

  const { blocksField, choices, position }: Props = $props();
</script>

<PopoverRoot>
  {const popoverContext = getPopoverContext()}

  <div class="flex items-center gap-2">
    <Separator orientation="horizontal" class="border-mist-default w-full border-dashed" />
    <PopoverAnchor>
      <PopoverButton class="text-nowrap text-mist-500">Aggiungi blocco</PopoverButton>
    </PopoverAnchor>
    <Separator orientation="horizontal" class="border-mist-default w-full border-dashed" />
  </div>

  <PopoverContent class="anchored-bottom-center">
    <div class="popover-default flex flex-col gap-2 p-2" transition:fly>
      {#each choices as c (c.value)}
        <button
          type="button"
          class="rounded-md bg-mist-500 px-2 py-1"
          onclick={() => {
            const blocks = blocksField.value() ?? [];
            const blocksBefore = blocks.slice(0, position);
            const blocksAfter = blocks.slice(position);
            blocksField.set([...blocksBefore, { type: c.value }, ...blocksAfter]);
            popoverContext.open = false;
          }}
        >
          {c.label}
        </button>
      {/each}
    </div>
  </PopoverContent>
</PopoverRoot>
