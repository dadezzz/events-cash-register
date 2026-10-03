<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { getPopoverContext } from "./index.ts";

  type Props = HTMLButtonAttributes;

  const { children, ...props }: Props = $props();

  const context = getPopoverContext();
</script>

<button
  {...props}
  type="button"
  command="toggle-popover"
  commandfor={context.id}
  aria-haspopup="true"
  aria-expanded={context.open}
  aria-controls={context.id}
>
  {@render children?.()}
</button>
