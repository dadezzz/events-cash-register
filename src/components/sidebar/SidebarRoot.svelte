<script lang="ts">
  import type { Snippet } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { slide } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { afterNavigate } from "$app/navigation";
  import { type SidebarContext, setSidebarContext } from "./index.ts";

  interface Props {
    context: SidebarContext;
    content: Snippet;
    children: Snippet;
  }

  let { context = $bindable(), content: sbContent, children }: Props = $props();
  setSidebarContext(context);

  // SSR safe since sidebar should always be closed on initial rendering.
  // This matches tailwindcss's md breakpoint.
  const greatherThanTWLG = new MediaQuery("(width >= 1024px)", false);

  // Close sidebar on mobile navigation.
  afterNavigate(() => {
    if (!greatherThanTWLG.current) {
      context.open = false;
    }
  });
</script>

<!-- Inherit the height from parent. -->
<div class="flex h-full">
  <Dialog bind:open={context.open} useOverlay={!greatherThanTWLG.current} usePortal={!greatherThanTWLG.current}>
    {#snippet content({ props })}
      <aside
        {...props}
        class={[greatherThanTWLG.current ? "" : "fixed inset-y-0 z-50 bg-default text-default"]}
        transition:slide={{ axis: "x" }}
      >
        {@render sbContent()}
      </aside>
    {/snippet}
  </Dialog>

  <!--
    Flex and flex col so that the user can use h-full elements without them
    overflowing at the bottom.
  -->
  <main class="w-full flex flex-col">
    {@render children()}
  </main>
</div>
