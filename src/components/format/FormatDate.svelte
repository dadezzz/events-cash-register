<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLElement> {
    date: Date | null;
    showTime?: boolean;
  }

  const { date, showTime = false, ...rest }: Props = $props();
</script>

{#if date !== null}
  <time {...rest} datetime={date.toISOString()} class={["text-nowrap select-all", rest.class]}>
    {date.toDateString()}

    {#if showTime}
      {date.toTimeString()}
    {/if}
  </time>
{/if}
