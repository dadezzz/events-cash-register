<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";

  interface Props {
    open?: boolean;
    useOverlay?: boolean;
    usePortal?: boolean;
    trigger?: Snippet<[{ props: Record<string, unknown> }]>;
    content: Snippet<[{ props: Record<string, unknown> }]>;
  }

  let { open = $bindable(false), useOverlay = true, usePortal = true, trigger, content }: Props = $props();
</script>

{#snippet inner()}
  {#if useOverlay}
    <Dialog.Overlay forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div {...props} transition:fade class="fixed inset-0 z-50 bg-mist-950/60 backdrop-blur-xs"></div>
        {/if}
      {/snippet}
    </Dialog.Overlay>
  {/if}

  <Dialog.Content
    forceMount
    interactOutsideBehavior={useOverlay ? "close" : "ignore"}
    escapeKeydownBehavior={useOverlay ? "close" : "ignore"}
    trapFocus={useOverlay}
    preventScroll={useOverlay}
  >
    {#snippet child({ open, props })}
      {#if open}
        {@render content({ props })}
      {/if}
    {/snippet}
  </Dialog.Content>
{/snippet}

<Dialog.Root bind:open>
  {#if trigger}
    <Dialog.Trigger child={trigger} />
  {/if}

  {#if usePortal}
    <Dialog.Portal>{@render inner()}</Dialog.Portal>
  {:else}
    {@render inner()}
  {/if}
</Dialog.Root>
