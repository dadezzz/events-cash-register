<script lang="ts">
  import type { RemoteFormFields } from "@sveltejs/kit";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { iteratorToNumber } from "#lib/array.ts";
  import type { BlockData } from "#lib/entities/printer/receipt-template/schema.ts";

  interface Props extends Omit<HTMLButtonAttributes, "type" | "onclick"> {
    position: number;
    blocksField: RemoteFormFields<BlockData[]>;
  }

  const { position, blocksField, children, ...rest }: Props = $props();
</script>

<button
  {...rest}
  type="button"
  aria-label="Rimuovi blocco"
  onclick={() => {
    const blocks = blocksField.value();
    for (const j of iteratorToNumber(position, blocksField.value().length)) {
      blocks[j] = blocks[j + 1];
    }
    blocks.pop();
    blocksField.set(blocks);
  }}
>
  {@render children?.()}
</button>
