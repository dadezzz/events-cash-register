<script lang="ts">
  import type { RemoteFormFields } from "@sveltejs/kit";
  import { XIcon } from "phosphor-svelte";
  import FieldErrors from "#components/form/input/FieldErrors.svelte";
  import { HiddenInput } from "#components/form/input/index.ts";
  import {
    type BlockData,
    type LineBlockData,
    type ProductOptionsBlockData,
    productOptionsPlaceholderBlockEntries,
  } from "#lib/entities/printer/receipt-template/schema.ts";
  import AddBlockButton from "./AddBlockButton.svelte";
  import DeleteBlockButton from "./DeleteBlockButton.svelte";
  import LineBlock from "./LineBlock.svelte";

  interface Props {
    field: RemoteFormFields<ProductOptionsBlockData>;
    blocksField: RemoteFormFields<BlockData[]>;
    position: number;
  }

  const { field, blocksField, position }: Props = $props();
</script>

{#snippet addBlockButton(position: number)}
  <AddBlockButton blocksField={field.blocks} {position} choices={[{ label: "Aggiungi blocco linea", value: "line" }]} />
{/snippet}

<div class="border-mist-strong relative flex flex-col gap-2 rounded-md border p-2 hover:border-mist-500">
  <h4 class="font-semibold">Opzioni prodotto</h4>

  <DeleteBlockButton {blocksField} {position} class="absolute top-2 right-2">
    <XIcon class="size-4" />
  </DeleteBlockButton>

  <HiddenInput field={field.type} value="productOptions" />

  {@render addBlockButton(0)}

  {#each field.blocks.value() as _, i (i)}
    {@const block = field.blocks[i]}

    <LineBlock
      field={block as RemoteFormFields<LineBlockData>}
      blocksField={field.blocks}
      position={i}
      placeHolderEntries={productOptionsPlaceholderBlockEntries.map((e) => ({ value: e, label: e }))}
    />

    {@render addBlockButton(i + 1)}
  {/each}

  <FieldErrors errors={field.blocks.issues()} />
</div>
