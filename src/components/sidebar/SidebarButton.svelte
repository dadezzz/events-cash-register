<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { getSidebarContext, type SidebarContext } from "./index.ts";

  interface Props extends Omit<HTMLButtonAttributes, "type" | "onclick" | "children"> {
    children: Snippet<[{ context: SidebarContext }]>;
  }

  const { children, ...props }: Props = $props();

  const context = getSidebarContext();
</script>

<button
  {...props}
  type="button"
  onclick={() => {
    context.open = !context.open;
  }}
  data-sidebar-open={context.open}
>
  {@render children({ context })}
</button>
