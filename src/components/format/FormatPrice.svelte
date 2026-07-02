<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { priceToString } from "#lib/price.ts";

  interface Props extends HTMLAttributes<HTMLElement> {
    price: number | null;
  }

  const { price, ...rest }: Props = $props();
</script>

<span {...rest} class={["text-nowrap select-all", rest.class]}>
  {#if price !== null}
    {priceToString(price)}
    €
  {:else}
    -- €
  {/if}
</span>
