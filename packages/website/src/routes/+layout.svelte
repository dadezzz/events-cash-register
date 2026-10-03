<script lang="ts">
  import NavigationDimmer from "#components/navigation/indicators/Dimmer.svelte";
  import NavigationProgressBar from "#components/navigation/indicators/ProgressBar.svelte";
  import type { LayoutProps, Snapshot } from "./$types";
  import "#assets/tailwind.css";
  import { createDialogContext, type DialogContext } from "#components/dialog/index.ts";
  import { SidebarContent, SidebarRoot } from "#components/sidebar/index.ts";

  const { children }: LayoutProps = $props();

  const id = $props.id();

  const progressBarId = `${id}-progressbar`;
  let progressBarProgress = $state(0);

  const sidebarId = `${id}-sidebar`;
  let sidebarContext = $state(createDialogContext(sidebarId));
  export const snapshot: Snapshot<DialogContext> = {
    capture: () => sidebarContext,
    restore: (v) => (sidebarContext = v),
  };
</script>

<!-- Shown while the page is loading. -->
<NavigationProgressBar id={progressBarId} bind:progress={progressBarProgress} />
<NavigationDimmer />

<div aria-busy={progressBarProgress !== 0} aria-describedby={progressBarId} class="bg-default text-default h-screen">
  <SidebarRoot bind:dialogContext={sidebarContext} {children}>
    {#snippet content()}
      <SidebarContent />
    {/snippet}
  </SidebarRoot>
</div>
