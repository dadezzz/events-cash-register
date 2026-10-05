<script lang="ts">
  import type { Snippet } from "svelte";
  import Header from "#components/Header.svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<Header>
  <p>Ricevute e comande</p>
</Header>

{@render children()}
