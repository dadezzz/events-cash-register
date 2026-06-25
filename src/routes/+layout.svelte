<script lang="ts">
  import NavigationDimmer from "#components/navigation/indicators/Dimmer.svelte";
  import NavigationProgressBar from "#components/navigation/indicators/ProgressBar.svelte";
  import type { LayoutProps } from "./$types";
  import "#assets/tailwind.css";

  const { children }: LayoutProps = $props();

  const progressBarId = $props.id();
  let progressBarProgress = $state(0);
</script>

<!-- Shown while the page is loading. -->
<NavigationProgressBar id={progressBarId} bind:progress={progressBarProgress} />
<NavigationDimmer />

<div aria-busy={progressBarProgress !== 0} aria-describedby={progressBarId} class="contents">{@render children()}</div>
