<script lang="ts">
  import type { Snippet } from "svelte";
  import { getDialogContext } from ".";
  import { DialogOverlay } from "./index.ts";

  interface Props {
    overlay?: boolean;
    children: Snippet;
  }

  let { overlay = true, children }: Props = $props();

  const context = getDialogContext();

  // Allows to wait for closing the dialog until when outro animations have
  // completed.
  let closing = $state(false);

  let htmlDialog: HTMLDialogElement | undefined = $state();

  // Open/close the dialog when the open variable changes.
  $effect(() => {
    if (htmlDialog) {
      if (!htmlDialog.open && context.open) {
        if (overlay) {
          htmlDialog.showModal();
        } else {
          htmlDialog.show();
        }
      }

      if (htmlDialog.open && !context.open && !closing) {
        htmlDialog.close();
      }
    }
  });

  async function handleCancel(event: Event) {
    // Let the outro finish before removing the dialog from the top layer.
    event.preventDefault();
    closing = true;
    context.open = false;
  }

  function handleClose() {
    closing = true;
    context.open = false;
  }

  function handleoutroEnd() {
    closing = false;
  }
</script>

{#if overlay}
  <DialogOverlay />

  <dialog
    bind:this={htmlDialog}
    id={context.id}
    oncancel={handleCancel}
    onclose={handleClose}
    onoutroendcapture={handleoutroEnd}
    closedby="any"
  >
    {#if context.open}
      {@render children()}
    {/if}
  </dialog>
{:else if context.open}
  {@render children()}
{/if}
