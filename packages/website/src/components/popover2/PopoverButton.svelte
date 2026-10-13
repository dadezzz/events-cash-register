<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { getPopoverContext } from "./index.ts";

  type Props = HTMLButtonAttributes;

  const { children, onclick, ...rest }: Props = $props();

  const context = getPopoverContext();
</script>

{#if context.type === "js"}
  <button
    {...rest}
    type="button"
    data-open={context.open}
    aria-expanded={context.open}
    aria-controls={context.popoverId}
    onclick={(event) => {
      context.open = !context.open;
      onclick?.(event);
    }}
  >
    {@render children?.()}
  </button>
{:else}
  <button
    {...rest}
    type="button"
    data-open={context.open}
    aria-expanded={context.open}
    aria-controls={context.popoverId}
    command="toggle-popover"
    commandfor={context.popoverId}
    {onclick}
  >
    {@render children?.()}
  </button>
{/if}
