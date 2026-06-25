<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import Field from "./Field.svelte";
  import FieldErrors from "./FieldErrors.svelte";
  import FieldLabel from "./FieldLabel.svelte";
  import type { InputProps } from "./index.ts";

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
        class="rounded-md border border-slate-300 px-3 py-2 outline-red-300 hover:border-red-500 focus:outline-3"
        onblur={(e) => {
          e.currentTarget.value = field.value()?.trim() ?? "";
        }}
        {...rest}
      />

      <FieldErrors {...errorProps} />
    </div>
  {/snippet}
</Field>
