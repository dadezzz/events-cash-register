<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { getPopoverContext, popoverAnchorName } from "./index.ts";

  type Props = HTMLAttributes<HTMLElement>;

  const { children, class: className, ...rest }: Props = $props();

  const context = getPopoverContext();
</script>

<div {...rest} class={["anchor/(--anchor-name)", className]} style="--anchor-name: {popoverAnchorName(context.id)}">
  {@render children?.()}
</div>
