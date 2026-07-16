<!--
  Difference between this and NumericInput is that this sends a string to the
  server.
  It's useful to get numeric strings that aren't numbers, like email challenge
  codes.
-->

<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { InputProps } from ".";
  import Field from "./Field.svelte";
  import FieldErrors from "./FieldErrors.svelte";
  import FieldLabel from "./FieldLabel.svelte";

  type Props = HTMLInputAttributes & InputProps<string>;
  const { field, label, ...rest }: Props = $props();
</script>

<Field {field}>
  {#snippet children({ errorProps, inputProps, labelProps })}
    <div class="flex flex-col gap-2">
      <FieldLabel {...labelProps}>{label}</FieldLabel>

      <input
        {...inputProps}
        {...field.as("text")}
        inputmode="numeric"
        class="rounded-md border border-mist-strong px-3 py-2 outline-emerald-default hover:border-emerald-strong focus:outline-2"
        oninput={(e) => {
          e.currentTarget.value = field.value()?.trim() ?? "";
        }}
        {...rest}
      />

      <FieldErrors {...errorProps} />
    </div>
  {/snippet}
</Field>
