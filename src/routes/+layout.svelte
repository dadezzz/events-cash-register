<script lang="ts">
  import NavigationDimmer from "#components/navigation/indicators/Dimmer.svelte";
  import NavigationProgressBar from "#components/navigation/indicators/ProgressBar.svelte";
  import type { LayoutProps, Snapshot } from "./$types";
  import "#assets/tailwind.css";
  import { SidebarContent, type SidebarContext, SidebarRoot } from "#components/sidebar/index.ts";

  const { children }: LayoutProps = $props();

  const progressBarId = $props.id();
  let progressBarProgress = $state(0);

  let sidebarContext = $state({ open: false });
  export const snapshot: Snapshot<SidebarContext> = {
    capture: () => sidebarContext,
    restore: (v) => (sidebarContext = v),
  };
</script>

<!-- Shown while the page is loading. -->
<NavigationProgressBar id={progressBarId} bind:progress={progressBarProgress} />
<NavigationDimmer />

<div aria-busy={progressBarProgress !== 0} aria-describedby={progressBarId} class="h-screen bg-default text-default">
  <SidebarRoot bind:context={sidebarContext} {children}>
    {#snippet content()}
      <SidebarContent />
    {/snippet}
  </SidebarRoot>
</div>
