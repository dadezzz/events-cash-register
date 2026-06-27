<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLHRElement> {
    "aria-orientation": "horizontal" | "vertical";
  }

  const props: Props = $props();
</script>

<hr {...props} />
