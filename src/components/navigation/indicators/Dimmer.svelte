<!--
  Covers the page with a white semi-transparent background, to indicate that the
  load is taking more time than expected and that the page is unresponsive.
-->

<script lang="ts" module>
  const START_DELAY = 5000;
</script>

<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  let show = $state(false);
  let startTimeout: ReturnType<typeof setTimeout> | undefined;

  beforeNavigate((e) => {
    // Prevent the callback from running when the link is to another site or the
    // protocol is tel: or mailto:.
    if (e.type === "leave") return;

    // Show only for navigations taking longer than START_DELAY.
    startTimeout = setTimeout(() => {
      show = true;
    }, START_DELAY);
  });

  // Remove the dimmer on load completion.
  afterNavigate(() => {
    // Handle navigation completing before the start timeout completes.
    clearTimeout(startTimeout);
    show = false;
  });
</script>

{#if show}
  <div
    class="fixed z-49 h-full w-full bg-white/40"
    role="alert"
    aria-live="polite"
    aria-label="Loading, please wait. The page is unresponsive."
  ></div>
{/if}
