<script lang="ts">
  import type { Snippet } from "svelte";
  import { createPopoverContext, type PopoverContext, setPopoverContext } from "./index.ts";

  interface Props {
    children: Snippet;
    context?: PopoverContext;
  }

  const id = $props.id();

  let { children, context = $bindable(createPopoverContext(id)) }: Props = $props();

  setPopoverContext(context);
</script>

{@render children()}
