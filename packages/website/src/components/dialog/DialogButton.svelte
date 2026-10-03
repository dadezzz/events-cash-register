<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { getDialogContext } from "./index.ts";

  type Props = HTMLButtonAttributes;

  const { children, onclick, ...props }: Props = $props();

  const context = getDialogContext();
</script>

<button
  {...props}
  type="button"
  aria-haspopup="dialog"
  aria-controls={context.id}
  aria-expanded={context.open}
  onclick={(e) => {
    if (onclick) {
      onclick(e);
    } else {
      context.open = !context.open;
    }
  }}
>
  {@render children?.()}
</button>
