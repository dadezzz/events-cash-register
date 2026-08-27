<script lang="ts">
  import type { RemoteFormFields } from "@sveltejs/kit";
  import { XIcon } from "phosphor-svelte";
  import { ComboBoxInput, HiddenInput } from "#components/form/input/index.ts";
  import type { BlockData, PlaceholderBlockData } from "#lib/entities/printer/receipt-template/schema.ts";
  import DeleteBlockButton from "./DeleteBlockButton.svelte";

  interface Props {
    field: RemoteFormFields<PlaceholderBlockData>;
    blocksField: RemoteFormFields<BlockData[]>;
    position: number;
    entries: { value: string; label: string }[];
  }

  const { field, blocksField, position, entries }: Props = $props();
</script>

<HiddenInput field={field.type} value="placeholder" />

<div class="flex gap-2">
  <ComboBoxInput field={field.placeholder} label="Placeholder" {entries} />

  <DeleteBlockButton {blocksField} {position}>
    <XIcon class="size-4" />
  </DeleteBlockButton>
</div>
