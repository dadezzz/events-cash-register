<!--
  Covers the page with a white semi-transparent background, to indicate that the
  load is taking more time than expected and that the page is unresponsive.
-->

<script lang="ts" module>
  const START_DELAY = 5000;
</script>

<script lang="ts">
  import { SpinnerGapIcon } from "phosphor-svelte";
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
    class="fixed inset-0 z-70 flex items-center justify-center bg-mist-50/60 opacity-100 transition-opacity duration-200 dark:bg-mist-50/40 starting:opacity-0"
    role="alert"
    aria-live="polite"
    aria-label="La pagina sta caricando più lentamente del previsto"
  >
    <SpinnerGapIcon class="size-12 animate-spin text-emerald-500" />
  </div>
{/if}
