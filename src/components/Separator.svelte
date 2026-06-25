<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLAttributes<HTMLElement>, "role"> {
    "aria-orientation": "horizontal" | "vertical";
  }

  const props: Props = $props();
</script>

<!-- biome-ignore lint/a11y/useAriaPropsForRole: TODO: Can't find what attributes it wants. -->
<div {...props} role="separator"></div>
