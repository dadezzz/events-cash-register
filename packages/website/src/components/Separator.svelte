<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLHRElement> {
    orientation: "horizontal" | "vertical";
  }

  const { orientation, ...props }: Props = $props();
</script>

<hr aria-orientation={orientation} {...props} />
