<!--
  Displays a small bar at the top of the page when navigating. This improves the
  user experience because it implicitly tells them that the website is still
  responding but that it is waiting to load something.
-->

<script lang="ts" module>
  const MAX_WIDTH = 0.95;
  const STARTING_WIDTH = 0.1;
  const PROGRESS_INTERVAL = 700;
  const START_DELAY = 500;
</script>

<script lang="ts">
  import { slide } from "svelte/transition";
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  interface Props {
    id: string;
    progress: number;
  }

  let { id, progress = $bindable(0) }: Props = $props();
  let progressTimeout: ReturnType<typeof setTimeout> | undefined;

  // Continue the animation of the progress bar from whatever position it is in,
  // using a randomized step size to increment.
  function progressAnimation(): void {
    // Every 700 milliseconds make the progressbar a bit wider.
    progressTimeout = setTimeout(() => {
      // Random increments to add each time to make the loading feel more natural.
      const random = [0, 0.1, 0.2, 0.4];
      // Towards the end of the progress bar animation, we want to shorten the
      // increment step size, to give it the appearance of slowing down. This
      // indicates to the user that progress is still happening, but not as fast as
      // they might like.
      progress += Math.min(MAX_WIDTH, 0.3 / 50 ** (progress + random[Math.floor(Math.random() * random.length)]));

      // If the page hasn't loaded yet. Then stop the animation to signal to the
      // user that something is taking a very long time.
      if (progress >= MAX_WIDTH) {
        clearTimeout(progressTimeout);
      } else {
        progressAnimation();
      }
    }, PROGRESS_INTERVAL);
  }

  // Moves the progress bar to the fully completed position, wait an appropriate
  // amount of time so the user can see the completion, then hide and reset.
  function completeAnimation(): void {
    // Stop the progress animation.
    clearTimeout(progressTimeout);
    // Set width to full.
    progress = 1;

    // Wait 700 milliseconds after the complete method is called and before
    // hiding the progress bar. Letting it sit at 100% width for a very short
    // time makes it feel more fluid.
    setTimeout(() => {
      progress = 0;
    }, PROGRESS_INTERVAL);
  }

  let startTimeout: ReturnType<typeof setTimeout> | undefined;

  beforeNavigate((e) => {
    // Prevent the callback from running when the link is to another site or the
    // protocol is tel: or mailto:.
    if (e.type === "leave") return;

    startTimeout = setTimeout(() => {
      progress = STARTING_WIDTH;
      progressAnimation();
    }, START_DELAY);
  });

  // Remove the bar on load completion.
  afterNavigate(() => {
    // Handle navigation completing before the start timeout completes.
    clearTimeout(startTimeout);
    if (progress > 0) completeAnimation();
  });
</script>

<div
  {id}
  aria-label="Progresso di caricamento della pagina"
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={1}
  class="fixed top-0 left-0 z-80 h-1 w-full"
>
  <!--
    Unmount to prevent the width transition to be displayed when the bar goes
    from 1 to 0.
  -->
  {#if progress > 0}
    <div transition:slide class="h-1 bg-emerald-500 transition-[width]" style="width: {progress * 100}%"></div>
  {/if}
</div>
