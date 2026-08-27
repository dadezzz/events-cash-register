<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    for: string;
    "data-invalid": boolean;
    children: Snippet;
  }

  const { children, ...rest }: Props = $props();
</script>

<!-- biome-ignore lint/a11y/noLabelWithoutControl: There is a for attribute in rest :| -->
<label
  {...rest}
  class="data-[invalid=true]:text-red-default w-fit text-sm text-mist-700 transition-colors dark:text-mist-300"
>
  {@render children()}
</label>
