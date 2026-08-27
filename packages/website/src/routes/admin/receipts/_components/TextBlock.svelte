<script lang="ts">
  import type { RemoteFormFields } from "@sveltejs/kit";
  import { XIcon } from "phosphor-svelte";
  import { HiddenInput, TextInput } from "#components/form/input/index.ts";
  import type { BlockData, TextBlockData } from "#lib/entities/printer/receipt-template/schema.ts";
  import DeleteBlockButton from "./DeleteBlockButton.svelte";

  interface Props {
    field: RemoteFormFields<TextBlockData>;
    blocksField: RemoteFormFields<BlockData[]>;
    position: number;
  }

  const { field, blocksField, position }: Props = $props();
</script>

<HiddenInput field={field.type} value="text" />

<div class="flex gap-2">
  <TextInput field={field.text} label="Testo" />

  <DeleteBlockButton {blocksField} {position}>
    <XIcon class="size-4" />
  </DeleteBlockButton>
</div>
