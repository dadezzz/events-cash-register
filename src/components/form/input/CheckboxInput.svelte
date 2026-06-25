<script lang="ts">
  import { CheckIcon } from "phosphor-svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { InputProps } from ".";
  import Field from "./Field.svelte";
  import FieldErrors from "./FieldErrors.svelte";

  type Props = HTMLInputAttributes & InputProps<boolean>;
  const { field, label, ...rest }: Props = $props();
</script>

<Field {field}>
  {#snippet children({ errorProps, inputProps, labelProps })}
    <div class="flex flex-col gap-2">
      <label
        {...labelProps}
        class="group flex w-fit items-center gap-2 text-sm text-slate-500 transition-colors data-[invalid=true]:text-red-800"
      >
        <input {...inputProps} {...field.as("checkbox")} class="peer sr-only" {...rest} />

        <div
          class="flex size-5 items-center justify-center rounded-md border border-slate-300 p-0.5 outline-red-300 transition-colors group-hover:outline-3 group-has-[input:checked]:bg-red-600 group-has-[input:focus]:outline-3"
        >
          <CheckIcon class="size-5 text-white not-group-has-[input:checked]:hidden" weight="bold" />
        </div>

        {label}
      </label>

      <FieldErrors {...errorProps} />
    </div>
  {/snippet}
</Field>
