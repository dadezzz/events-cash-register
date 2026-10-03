<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { getPopoverContext, popoverAnchorName } from "./index.ts";

  interface Props extends HTMLAttributes<HTMLElement> {
    children: Snippet;
  }

  let { children, class: className, ...rest }: Props = $props();

  const context = getPopoverContext();

  let htmlPopover: HTMLElement | undefined = $state();

  // Handle when users set the context.open's value programmatically.
  $effect(() => {
    if (!htmlPopover) {
      return;
    }

    if (context.open && !htmlPopover.matches(":popover-open")) {
      htmlPopover.showPopover();
    } else if (!context.open && htmlPopover.matches(":popover-open")) {
      htmlPopover.hidePopover();
    }
  });
</script>

<div
  {...rest}
  bind:this={htmlPopover}
  id={context.id}
  popover="auto"
  style="--anchor-name: {popoverAnchorName(context.id)}"
  // w-max and h-max avoid text shrinking.
  class={["anchored/(--anchor-name) h-max w-max", className]}
  ontoggle={(e) => {
    context.open = e.newState === "open";
  }}
>
  {#if context.open}
    {@render children()}
  {/if}
</div>
