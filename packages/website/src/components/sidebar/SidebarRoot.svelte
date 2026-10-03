<script lang="ts">
  import type { Snippet } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { slide } from "svelte/transition";
  import { DialogContent, type DialogContext, DialogRoot } from "#components/dialog/index.ts";
  import { afterNavigate } from "$app/navigation";

  interface Props {
    context: DialogContext;
    content: Snippet;
    children: Snippet;
  }

  let { context = $bindable(), content, children }: Props = $props();

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
  <DialogRoot bind:context>
    <DialogContent overlay={!greatherThanTWLG}>
      <aside class="bg-default text-default max-lg:fixed max-lg:inset-y-0 max-lg:z-50" transition:slide={{ axis: "x" }}>
        {@render content()}
      </aside>
    </DialogContent>

    <!--
    Flex and flex col so that the user can use h-full elements without them
    overflowing at the bottom.
  -->
    <main class="flex w-full flex-col">
      {@render children()}
    </main>
  </DialogRoot>
</div>
