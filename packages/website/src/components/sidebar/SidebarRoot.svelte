<script lang="ts">
  import type { Snippet } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { type DialogContext, DialogOverlay, DialogRoot } from "#components/dialog/index.ts";
  import { afterNavigate } from "$app/navigation";

  interface Props {
    dialogContext: DialogContext;
    content: Snippet;
    children: Snippet;
  }

  let { dialogContext = $bindable(), content, children }: Props = $props();

  // Matches Tailwindcss's md breakpoint.
  const greaterThanTWMDQuery = new MediaQuery("(width >= 768px)", false);
  const greaterThanTWMD = $derived(greaterThanTWMDQuery.current);

  // Close sidebar on mobile navigation.
  afterNavigate(() => {
    if (!greaterThanTWMD) {
      dialogContext.open = false;
    }
  });
</script>

<!-- Inherit the height from parent. -->
<div class="flex h-full">
  <DialogRoot bind:context={dialogContext}>
    <DialogOverlay class="z-20! md:data-[open=true]:hidden" />

    <dialog
      open
      id={dialogContext.id}
      data-open={dialogContext.open}
      class="border-mist-strong text-default bg-default invisible fixed left-0 z-30 h-full w-0 max-w-fit overflow-x-hidden border-r shadow transition-[width,visibility] data-[open=true]:visible data-[open=true]:w-full data-[open=true]:duration-200 md:static"
    >
      <aside class="p-2">
        {@render content()}
      </aside>
    </dialog>

    <!--
      Flex and flex col so that the user can use h-full elements without them
      overflowing at the bottom.
    -->
    <main class="flex w-full flex-col">
      {@render children()}
    </main>
  </DialogRoot>
</div>
