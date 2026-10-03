<script lang="ts">
  import type { ClassValue } from "svelte/elements";
  import { DialogButton } from "./index.ts";

  interface Props {
    class?: ClassValue;
  }

  const { class: className }: Props = $props();
</script>

<DialogButton
  aria-hidden="true"
  class={[
    "invisible fixed inset-0 z-40 bg-mist-950/60 opacity-0 backdrop-blur-xs transition-[opacity,visibility] duration-200 data-[open=true]:visible data-[open=true]:opacity-100",
    className,
  ]}
  tabindex={-1}
/>
