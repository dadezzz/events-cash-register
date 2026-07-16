<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import Field from "./Field.svelte";
  import FieldErrors from "./FieldErrors.svelte";
  import FieldLabel from "./FieldLabel.svelte";
  import type { InputProps } from "./index.ts";

  type Props = HTMLTextareaAttributes & InputProps<string>;
  const { field, label, ...rest }: Props = $props();
</script>

<Field {field}>
  {#snippet children({ errorProps, inputProps, labelProps })}
    <div class="flex flex-col gap-2">
      <FieldLabel {...labelProps}>{label}</FieldLabel>

      <textarea
        {...inputProps}
        {...field.as("text")}
        class="rounded-md border border-mist-strong px-3 py-2 outline-emerald-default hover:border-emerald-strong focus:outline-2"
        {...rest}
      ></textarea>

      <FieldErrors {...errorProps} />
    </div>
  {/snippet}
</Field>
