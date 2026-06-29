<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Duration } from "#lib/duration.ts";

  interface Props extends HTMLAttributes<HTMLElement> {
    duration: Duration;
    // How many parts to show (eg. 5:03 minutes will be shown as `5 minutes`
    // with 1 level and `5 minutes and 3 seconds` with 2 levels).
    // Must be equal or greater than 1.
    levels?: number;
  }

  const { duration, levels = 1, ...rest }: Props = $props();

  const splits = $derived([
    duration.asDays(),
    duration.asHours() % 24,
    duration.asMinutes() % 60,
    duration.asSeconds() % 60,
  ]);

  const startSplitIdx = $derived.by(() => {
    let i = splits.findIndex((s) => s !== 0);

    if (i === -1) {
      i = splits.length - 1;
    }

    return i;
  });

  const splitsNamesSingular = ["giorno", "ora", "minuto", "secondo"];
  const splitsNamesPlural = ["giorni", "ore", "minuti", "secondi"];
  function getSplitStr(idx: number): string {
    return `${splits[idx]} ${splits[idx] === 1 ? splitsNamesSingular[idx] : splitsNamesPlural[idx]}`;
  }

  const splitString = $derived.by(() => {
    let str = getSplitStr(startSplitIdx);

    const maxIValue = Math.min(levels, splits.length - startSplitIdx);
    for (let i = 1; i < maxIValue; i++) {
      let separator = i === maxIValue - 1 ? " e " : ", ";
      str += `${separator}${getSplitStr(startSplitIdx + i)}`;
    }

    return str;
  });
</script>

{#if splits}
  <!-- For the datetime attribute see https://en.wikipedia.org/wiki/ISO_8601#Durations -->
  <time
    {...rest}
    datetime="P{splits[0]}DT{splits[1]}H{splits[2]}M{splits[3]}S"
    class={["text-nowrap select-all", rest.class]}
  >
    {splitString}
  </time>
{/if}
