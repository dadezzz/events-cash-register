<script lang="ts">
  import { Popover } from "bits-ui";
  import type { Snippet } from "svelte";

  interface Props {
    open?: boolean;
    autofocusContent?: boolean;
    trigger?: Snippet<[{ props: Record<string, unknown> }]>;
    content: Snippet<[{ props: Record<string, unknown> }]>;
  }

  let { open = $bindable(false), autofocusContent = true, trigger, content }: Props = $props();
</script>

<Popover.Root bind:open>
  {#if trigger}
    <Popover.Trigger child={trigger} />
  {/if}

  <Popover.Content
    class="popover-default"
    forceMount
    collisionPadding={8}
    onOpenAutoFocus={(e) => {
      if (!autofocusContent) {
        e.preventDefault();
      }
    }}
  >
    {#snippet child({ open, wrapperProps, props })}
      {#if open}
        <div {...wrapperProps}>
          <Popover.Arrow class="text-mist-200 dark:text-mist-800" />
          {@render content({ props })}
        </div>
      {/if}
    {/snippet}
  </Popover.Content>
</Popover.Root>
