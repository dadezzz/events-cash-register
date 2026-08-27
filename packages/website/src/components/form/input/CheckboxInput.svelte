<script lang="ts">
  import { CheckIcon } from "phosphor-svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { InputProps } from ".";
  import Field from "./Field.svelte";
  import FieldErrors from "./FieldErrors.svelte";
  import FieldLabel from "./FieldLabel.svelte";

  type Props = HTMLInputAttributes & InputProps<boolean>;
  const { field, label, ...rest }: Props = $props();
</script>

<Field {field}>
  {#snippet children({ errorProps, inputProps, labelProps })}
    <div class="group flex flex-col gap-2">
      <input {...inputProps} {...field.as("checkbox")} class="sr-only" {...rest} />

      <FieldLabel {...labelProps}>
        <div class="flex items-center gap-2">
          <div
            class="border-mist-strong outline-emerald-default flex size-5 items-center justify-center rounded-md border p-0.5 transition-colors group-hover:outline-2 group-has-[input:checked]:bg-emerald-700 group-has-[input:focus]:outline-2 dark:group-has-[input:checked]:bg-emerald-300"
          >
            <CheckIcon
              class="size-5 text-mist-100 not-group-has-[input:checked]:hidden dark:text-mist-900"
              weight="bold"
            />
          </div>

          {#if typeof label === "string"}
            {label}
          {:else}
            {@render label()}
          {/if}
        </div>
      </FieldLabel>

      <FieldErrors {...errorProps} />
    </div>
  {/snippet}
</Field>
