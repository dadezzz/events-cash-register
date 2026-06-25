<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  interface Props extends HTMLAnchorAttributes {
    href: string;
    /**
     * If enabled, it removes the href prop from the html <a> and sets
     * aria-disabled to true.
     */
    disabled?: boolean;
    children: Snippet;
  }

  const { children, href, disabled = false, ...rest }: Props = $props();
  let htmlHref: string | undefined = $derived(disabled ? undefined : href);
</script>

<a {...rest} href={htmlHref} aria-disabled={disabled}>{@render children()} </a>
