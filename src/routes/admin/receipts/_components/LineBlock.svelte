<script lang="ts">
  import type { RemoteFormFields } from "@sveltejs/kit";
  import { XIcon } from "phosphor-svelte";
  import FieldErrors from "#components/form/input/FieldErrors.svelte";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type {
    BlockData,
    LineBlockData,
    PlaceholderBlockData,
    TextBlockData,
  } from "#lib/entities/printer/receipt-template/schema.ts";
  import AddBlockButton from "./AddBlockButton.svelte";
  import DeleteBlockButton from "./DeleteBlockButton.svelte";
  import PlaceHolderBlock from "./PlaceHolderBlock.svelte";
  import TextBlock from "./TextBlock.svelte";

  interface Props {
    field: RemoteFormFields<LineBlockData>;
    blocksField: RemoteFormFields<BlockData[]>;
    position: number;
    placeHolderEntries: { value: string; label: string }[];
  }

  const { field, blocksField, position, placeHolderEntries }: Props = $props();
</script>

{#snippet addBlockButton(position: number)}
  <AddBlockButton
    blocksField={field.blocks as RemoteFormFields<BlockData[]>}
    {position}
    choices={[
      { label: "Aggiungi blocco testo", value: "text" },
      { label: "Aggiungi blocco placeholder", value: "placeholder" },
    ]}
  />
{/snippet}

<div class="border-mist-strong relative flex flex-col gap-2 rounded-md border p-2 hover:border-mist-500">
  <h4 class="font-semibold">Linea</h4>

  <DeleteBlockButton {blocksField} {position} class="absolute top-2 right-2">
    <XIcon class="size-4" />
  </DeleteBlockButton>

  <HiddenInput field={field.type} value="line" />

  {@render addBlockButton(0)}

  {#each field.blocks.value() as _, i (i)}
    {#if field.blocks[i].type.value() === "placeholder"}
      <PlaceHolderBlock
        field={field.blocks[i] as RemoteFormFields<PlaceholderBlockData>}
        blocksField={field.blocks as RemoteFormFields<BlockData[]>}
        position={i}
        entries={placeHolderEntries}
      />
    {:else if field.blocks[i].type.value() === "text"}
      <TextBlock
        field={field.blocks[i] as RemoteFormFields<TextBlockData>}
        blocksField={field.blocks as RemoteFormFields<BlockData[]>}
        position={i}
      />
    {/if}

    {@render addBlockButton(i + 1)}
  {/each}

  <FieldErrors errors={field.blocks.issues()} />
</div>
