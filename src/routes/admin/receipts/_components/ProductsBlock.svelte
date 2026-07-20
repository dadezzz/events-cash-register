<script lang="ts">
  import type { RemoteFormFields } from "@sveltejs/kit";
  import { XIcon } from "phosphor-svelte";
  import FieldErrors from "#components/form/input/FieldErrors.svelte";
  import { HiddenInput } from "#components/form/input/index.ts";
  import {
    type BlockData,
    type LineBlockData,
    type ProductOptionsBlockData,
    type ProductsBlockData,
    productPlaceholderBlockEntries,
  } from "#lib/entities/printer/receipt-template/schema.ts";
  import AddBlockButton from "./AddBlockButton.svelte";
  import DeleteBlockButton from "./DeleteBlockButton.svelte";
  import LineBlock from "./LineBlock.svelte";
  import ProductOptionsBlock from "./ProductOptionsBlock.svelte";

  interface Props {
    field: RemoteFormFields<ProductsBlockData>;
    blocksField: RemoteFormFields<BlockData[]>;
    position: number;
  }

  const { field, blocksField, position }: Props = $props();
</script>

{#snippet addBlockButton(position: number)}
  <AddBlockButton
    blocksField={field.blocks}
    {position}
    choices={[
      { label: "Aggiungi blocco linea", value: "line" },
      { label: "Aggiungi blocco opzioni", value: "productOptions" },
    ]}
  />
{/snippet}

<div class="border-mist-strong relative flex flex-col gap-2 rounded-md border p-2 hover:border-mist-500">
  <h4 class="font-semibold">Prodotti</h4>

  <DeleteBlockButton {blocksField} {position} class="absolute top-2 right-2">
    <XIcon class="size-4" />
  </DeleteBlockButton>

  <HiddenInput field={field.type} value="products" />

  {@render addBlockButton(0)}

  {#each field.blocks.value() as _, i (i)}
    {@const block = field.blocks[i]}

    {#if block.type.value() === "line"}
      <LineBlock
        field={block as RemoteFormFields<LineBlockData>}
        blocksField={field.blocks}
        position={i}
        placeHolderEntries={productPlaceholderBlockEntries.map((e) => ({ value: e, label: e }))}
      />
    {:else if block.type.value() === "productOptions"}
      <ProductOptionsBlock
        field={block as RemoteFormFields<ProductOptionsBlockData>}
        blocksField={field.blocks}
        position={i}
      />
    {/if}

    {@render addBlockButton(i + 1)}
  {/each}

  <FieldErrors errors={field.blocks.issues()} />
</div>
