<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    type: "button" | "submit";
    children: Snippet;
  }

  const { children, type, ...rest }: Props = $props();
</script>

<button {type} {...rest}>{@render children()}</button>
