<script lang="ts">
  import NavigationDimmer from "#components/navigation/indicators/Dimmer.svelte";
  import NavigationProgressBar from "#components/navigation/indicators/ProgressBar.svelte";
  import type { LayoutProps } from "./$types";
  import "#assets/tailwind.css";
  import { PopoverPortal } from "#components/popover2/index.ts";
  import { SidebarContent, SidebarRoot } from "#components/sidebar/index.ts";

  const { children }: LayoutProps = $props();

  const id = $props.id();

  const progressBarId = `${id}-progressbar`;
  let progressBarProgress = $state(0);
</script>

<NavigationProgressBar id={progressBarId} bind:progress={progressBarProgress} />
<NavigationDimmer />

<!-- h-screen to make the page height known to the CSS engine. -->
<div aria-busy={progressBarProgress !== 0} aria-describedby={progressBarId} class="bg-default text-default h-screen">
  <PopoverPortal>
    <SidebarRoot {children}>
      {#snippet content()}
        <SidebarContent />
      {/snippet}
    </SidebarRoot>
  </PopoverPortal>
</div>
