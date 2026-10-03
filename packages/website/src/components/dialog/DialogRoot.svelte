<script lang="ts">
  import type { Snippet } from "svelte";
  import { createDialogContext, type DialogContext, setDialogContext } from "./index.ts";

  interface Props {
    children: Snippet;
    context?: DialogContext;
  }

  const id = $props.id();

  let { children, context = $bindable(createDialogContext(id)) }: Props = $props();

  setDialogContext(context);
</script>

{@render children()}
