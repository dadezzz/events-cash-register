<script lang="ts">
  import type { RemoteFormField } from "@sveltejs/kit";
  import { CheckboxInput, RadioInput } from "#components/form/input/index.ts";
  import type { ProductOptionClient } from "#lib/entities/products/option/client.ts";

  interface Props {
    field: RemoteFormField<boolean | string>;
    option: ProductOptionClient;
  }

  const { field, option }: Props = $props();
</script>

{#if option.data.data.type === "boolean"}
  <CheckboxInput field={field as RemoteFormField<boolean>} label={option.data.name} />
{:else if option.data.data.type === "choice"}
  <RadioInput
    field={field as RemoteFormField<string>}
    entries={option.data.data.entries.map((e) => ({ value: e.value, label: e.value }))}
    label={option.data.name}
  >
    {#snippet entryUI({ label })}
      <div class="flex gap-1">
        <div class="rounded-full size-4 border border-slate-300">
          <div class="rounded-full size-2 group-has-[input:checked]/radio:block hidden bg-red-500"></div>
        </div>
        <span>{label}</span>
      </div>
    {/snippet}
  </RadioInput>
{/if}
