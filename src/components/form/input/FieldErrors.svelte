<script lang="ts">
  import { WarningCircleIcon } from "phosphor-svelte";

  interface Props {
    id: string;
    errors: { message: string }[] | undefined;
  }

  const { id, errors }: Props = $props();
</script>

{#if errors?.at(0)}
  <p class="flex items-center gap-2 text-sm text-red-800">
    <WarningCircleIcon class="size-4 shrink-0" />
    <span {id} aria-live="polite" role="alert">{errors[0].message}</span>
  </p>
{/if}
