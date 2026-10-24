<script lang="ts">
  import type { Snippet } from "svelte";
  import { type PopoverContext, setPopoverContext } from "./index.ts";

  interface Props {
    // Whether the popover is controlled via JS or the popover commands API.
    type: "js" | "auto" | "manual";
    children: Snippet;
  }

  const { type = "auto", children }: Props = $props();

  const popoverId = $props.id();

  // svelte-ignore state_referenced_locally See effect below that updates js.
  const context: PopoverContext = $state({ open: false, popoverId, type });
  setPopoverContext(context);

  // We cannot make context a derived, since the object would be recreated each
  // time js changes, breaking context. So we update it manually here.
  $effect.pre(() => {
    context.type = type;
  });
</script>

{@render children()}
