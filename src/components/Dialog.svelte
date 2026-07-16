<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { Snippet } from "svelte";

  interface Props {
    open?: boolean;
    trigger?: Snippet<[{ props: Record<string, unknown> }]>;
    content: Snippet<[{ props: Record<string, unknown> }]>;
  }

  let { open = $bindable(false), trigger, content }: Props = $props();
</script>

<Dialog.Root bind:open>
  {#if trigger}
    <Dialog.Trigger child={trigger} />
  {/if}

  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-mist-950/60 backdrop-blur-xs" />

    <Dialog.Content
      forceMount
      onOpenAutoFocus={(e) => {
        e.preventDefault();
      }}
    >
      {#snippet child({ open, props })}
        {#if open}
          {@render content({ props })}
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
