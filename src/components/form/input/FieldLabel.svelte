<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    for: string;
    "data-invalid": boolean;
    children: Snippet;
  }

  const { children, ...rest }: Props = $props();
</script>

<label {...rest} class="w-fit text-sm text-slate-500 transition-colors data-[invalid=true]:text-red-800">
  {@render children()}
</label>
