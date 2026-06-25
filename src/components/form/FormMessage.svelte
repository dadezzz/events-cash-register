<!--
  Displays a form warning message in a standard format.
-->

<script lang="ts">
  import { WarningIcon } from "phosphor-svelte";

  interface Props {
    message: string | null;
  }

  const { message }: Props = $props();
</script>

{#if message}
  <p class="flex items-center gap-2 px-1 text-sm text-yellow-700" role="alert" aria-live="assertive">
    <!--
      We use shrink-0 because when the text is longer than the line length, the
      triangle would shrink to make space for it.
    -->
    <WarningIcon class="size-5 shrink-0" weight="bold" />
    <span>{message}</span>
  </p>
{/if}
