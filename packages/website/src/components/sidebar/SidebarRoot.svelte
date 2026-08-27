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
  // This matches tailwindcss's lg breakpoint.
  const greaterThanTWLGQuery = new MediaQuery("(width >= 1024px)", false);
  const greatherThanTWLG = $derived(greaterThanTWLGQuery.current);

  // Close sidebar on mobile navigation.
  afterNavigate(() => {
    if (!greatherThanTWLG) {
      context.open = false;
    }
  });
</script>

<!-- Inherit the height from parent. -->
<div class="flex h-full">
  <Dialog bind:open={context.open} useOverlay={!greatherThanTWLG} usePortal={!greatherThanTWLG}>
    {#snippet content({ props })}
      <aside
        {...props}
        class="bg-default text-default max-lg:fixed max-lg:inset-y-0 max-lg:z-50"
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
  <main class="flex w-full flex-col">
    {@render children()}
  </main>
</div>
