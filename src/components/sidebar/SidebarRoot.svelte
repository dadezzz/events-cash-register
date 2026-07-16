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

  // SSR safe since sidebar should always be closed on initial rendering.
  // This matches tailwindcss's md breakpoint.
  const isMdWidth = new MediaQuery("(width >= 768px)", false);

  setSidebarContext(context);

  // Close sidebar on mobile navigation.
  afterNavigate(() => {
    if (!isMdWidth.current) {
      context.open = false;
    }
  });
</script>

<!-- Inherit the height from parent. -->
<div class="flex h-full">
  {#if context.open && isMdWidth.current}
    <aside transition:slide={{ axis: "x" }}>
      {@render sbContent()}
    </aside>
  {/if}

  <Dialog
    bind:open={() => !isMdWidth.current && context.open, (v) => {
        if (!isMdWidth.current) context.open = v;
      }}
  >
    {#snippet content({ props })}
      <aside {...props} class="fixed inset-y-0 z-50 bg-default text-default" transition:slide={{ axis: "x" }}>
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
