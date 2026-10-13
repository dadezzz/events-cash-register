<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { getPopoverContext } from "./index.ts";

  type Props = HTMLAttributes<HTMLElement>;

  const { children, class: className, ...rest }: Props = $props();

  const id = $props.id();
  const context = getPopoverContext();
  context.anchorId = id;
</script>

<div {...rest} class={["anchor/(--anchor-name)", className]} style="--anchor-name: {id}">
  {@render children?.()}
</div>
