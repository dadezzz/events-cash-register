<script lang="ts">
  import { EyeIcon, EyeSlashIcon } from "phosphor-svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { Button } from "#components/controls/index.ts";
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
        class="flex gap-3 overflow-hidden rounded-md border border-slate-300 outline-red-300 transition-colors focus-within:outline-3 hover:border-red-500"
      >
        <input
          {...inputProps}
          {...field.as(fieldType)}
          class="w-full border-none px-3 py-2 focus:outline-none"
          {...rest}
        />

        <Button
          type="button"
          class="rounded-none px-3 py-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none"
          onclick={() => (showPassword = !showPassword)}
          aria-label="Show password"
          aria-pressed={showPassword}
        >
          {#if showPassword}
            <EyeIcon class="size-5" />
          {:else}
            <EyeSlashIcon class="size-5" />
          {/if}
        </Button>
      </div>

      <FieldErrors {...errorProps} />
    </div>
  {/snippet}
</Field>
