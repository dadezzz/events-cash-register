<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";
  import { getDialogContext } from ".";

  interface Props {
    forceOpen?: boolean;
    overlay?: boolean;
    children: Snippet;
  }

  let { forceOpen = false, overlay = true, children }: Props = $props();

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

  // Prevent the page from scrolling behind a modal dialog.
  $effect(() => {
    if (overlay && context.open) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previous;
      };
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
  {#if forceOpen || context.open}
    <!-- Pointer events are prevented by dialog's backdrop. -->
    <div class="fixed inset-0 z-50 bg-mist-950/60 backdrop-blur-xs" transition:fade></div>
  {/if}

  <dialog
    bind:this={htmlDialog}
    id={context.id}
    oncancel={handleCancel}
    onclose={handleClose}
    onoutroendcapture={handleoutroEnd}
    closedby="any"
  >
    {#if forceOpen || context.open}
      {@render children()}
    {/if}
  </dialog>
{:else if forceOpen || context.open}
  {@render children()}
{/if}
