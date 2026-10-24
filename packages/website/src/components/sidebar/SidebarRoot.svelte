<script lang="ts">
  import type { Snippet } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { PopoverContent, PopoverRoot } from "#components/popover2/index.ts";

  interface Props {
    content: Snippet;
    children: Snippet;
  }

  let { content, children }: Props = $props();

  // Matches Tailwindcss's md breakpoint.
  const greaterThanTWMDQuery = new MediaQuery("(width >= 768px)", true);
  const greaterThanTWMD = $derived(greaterThanTWMDQuery.current);
</script>

<!-- Inherit the height from parent. -->
<div class="flex h-full">
  <PopoverRoot type={greaterThanTWMD ? "js" : "auto"}>
    <PopoverContent
      closeOnNav={!greaterThanTWMD}
      usePortal={!greaterThanTWMD}
      class="border-mist-strong popover-content popover-backdrop inset-y-0 left-0 z-30 m-0 h-full w-0 max-w-fit overflow-x-hidden border-r transition-[width,overlay] transition-discrete data-[open=true]:w-full max-md:shadow md:backdrop:hidden data-[open=true]:starting:w-0"
    >
      <aside class="p-2">
        {@render content()}
      </aside>
    </PopoverContent>

    <!--
      Flex and flex col so that the user can use h-full elements without them
      overflowing at the bottom.
    -->
    <main class="flex w-full flex-col">
      {@render children()}
    </main>
  </PopoverRoot>
</div>
