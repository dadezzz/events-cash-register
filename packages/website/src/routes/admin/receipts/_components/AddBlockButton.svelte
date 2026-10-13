<script lang="ts">
  import {
    getPopoverContext,
    PopoverAnchor,
    PopoverButton,
    PopoverContent,
    PopoverRoot,
  } from "#components/popover2/index.ts";
  import Separator from "#components/Separator.svelte";
  import type { BlockData } from "#lib/entities/printer/receipt-template/schema.ts";
  import type { RemoteFormFields } from "$app/server";

  interface Props {
    blocksField: RemoteFormFields<BlockData[]>;
    position: number;
    choices: { value: string; label: string }[];
  }

  const { blocksField, choices, position }: Props = $props();
</script>

<PopoverRoot type="auto">
  {const popoverContext = getPopoverContext()}

  <div class="flex items-center gap-2">
    <Separator orientation="horizontal" class="border-mist-default w-full border-dashed" />
    <PopoverAnchor>
      <PopoverButton class="text-nowrap text-mist-500">Aggiungi blocco</PopoverButton>
    </PopoverAnchor>
    <Separator orientation="horizontal" class="border-mist-default w-full border-dashed" />
  </div>

  <PopoverContent class="anchored-bottom-center popover-content popover-floating-border flex flex-col gap-2 p-2">
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
  </PopoverContent>
</PopoverRoot>
