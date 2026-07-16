<script lang="ts">
  import { EyeIcon, EyeSlashIcon } from "phosphor-svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { InputProps } from ".";
  import Field from "./Field.svelte";
  import FieldErrors from "./FieldErrors.svelte";
  import FieldLabel from "./FieldLabel.svelte";

  type Props = HTMLInputAttributes & InputProps<string>;
  const { field, label, ...rest }: Props = $props();

  let showPassword = $state(false);
  let fieldType = $derived(showPassword ? ("text" as const) : ("password" as const));
</script>

<Field {field}>
  {#snippet children({ errorProps, inputProps, labelProps })}
    <div class="flex flex-col gap-2">
      <FieldLabel {...labelProps}>{label}</FieldLabel>

      <div
        class="flex gap-3 overflow-hidden rounded-md border border-mist-strong outline-emerald-default transition-colors focus-within:outline-2 hover:border-emerald-strong"
      >
        <input
          {...inputProps}
          {...field.as(fieldType)}
          class="w-full border-none px-3 py-2 focus:outline-none"
          {...rest}
        />

        <button
          type="button"
          class="px-3 py-2 text-mist-400 dark:text-mist-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 dark:hover:text-emerald-400 focus:bg-emerald-50 dark:focus:bg-emerald-950 focus:text-emerald-600 dark:focus:text-emerald-400 focus:outline-none"
          onclick={() => (showPassword = !showPassword)}
          aria-label="Show password"
          aria-pressed={showPassword}
        >
          {#if showPassword}
            <EyeIcon class="size-5" />
          {:else}
            <EyeSlashIcon class="size-5" />
          {/if}
        </button>
      </div>

      <FieldErrors {...errorProps} />
    </div>
  {/snippet}
</Field>
