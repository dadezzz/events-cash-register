<script lang="ts">
  import type { RemoteFormFields } from "@sveltejs/kit";
  import FieldErrors from "#components/form/input/FieldErrors.svelte";
  import { HiddenInput } from "#components/form/input/index.ts";
  import {
    type LineBlockData,
    type ProductsBlockData,
    type RootBlockData,
    rootPlaceholderBlockEntries,
  } from "#lib/entities/printer/receipt-template/schema.ts";
  import AddBlockButton from "./AddBlockButton.svelte";
  import LineBlock from "./LineBlock.svelte";
  import ProductsBlock from "./ProductsBlock.svelte";

  interface Props {
    field: RemoteFormFields<RootBlockData>;
  }

  const { field }: Props = $props();
</script>

{#snippet addBlockButton(position: number)}
  <AddBlockButton
    blocksField={field.blocks}
    {position}
    choices={[
      { label: "Aggiungi blocco linea", value: "line" },
      { label: "Aggiungi blocco prodotti", value: "products" },
    ]}
  />
{/snippet}

<div class="flex flex-col gap-2">
  <HiddenInput field={field.type} value="root" />

  {@render addBlockButton(0)}

  {#each field.blocks.value() as _, i (i)}
    {@const block = field.blocks[i]}

    {#if block.type.value() === "line"}
      <LineBlock
        field={block as RemoteFormFields<LineBlockData>}
        blocksField={field.blocks}
        position={i}
        placeHolderEntries={rootPlaceholderBlockEntries.map((o) => ({ value: o, label: o }))}
      />
    {:else if block.type.value() === "products"}
      <ProductsBlock field={block as RemoteFormFields<ProductsBlockData>} blocksField={field.blocks} position={i} />
    {/if}

    {@render addBlockButton(i + 1)}
  {/each}

  <FieldErrors errors={field.blocks.issues()} />
</div>
