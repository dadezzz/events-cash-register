<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Duration } from "#lib/duration.ts";

  interface Props extends HTMLAttributes<HTMLElement> {
    duration: Duration;
    // How many parts to show (eg. 5:03 minutes will be shown as `5 minutes`
    // with 1 level and `5 minutes and 3 seconds` with 2 levels).
    // Must be equal or greater than 1.
    precision?: number;
  }

  const { duration, precision = 1, ...rest }: Props = $props();
</script>

<time {...rest} datetime={duration.toISOString()} class={["text-nowrap select-all", rest.class]}>
  {duration.toString(precision)}
</time>
