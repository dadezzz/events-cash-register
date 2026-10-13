<script lang="ts">
  import type { Snippet } from "svelte";
  import { type PopoverPortalContext, setPopoverPortalContext } from "./index.ts";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();

  const context: PopoverPortalContext = $state({});
  setPopoverPortalContext(context);
</script>

<div bind:this={context.mainDiv} class="contents">
  {@render children()}
</div>

<div bind:this={context.portalDiv} class="contents"></div>
