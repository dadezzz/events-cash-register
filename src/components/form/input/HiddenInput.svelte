<script lang="ts">
  import type { RemoteFormField } from "@sveltejs/kit";
  import Field from "./Field.svelte";
  import FieldErrors from "./FieldErrors.svelte";

  interface Props {
    field: RemoteFormField<string>;
    value: string | undefined;
    showErrors?: boolean;
  }

  const { field, value, showErrors = false }: Props = $props();
</script>

<!--
  Mounts the component only if value is defined, useful for optional inputs.
-->
{#snippet input(props: Record<string, unknown>)}
  {#if value}
    <input {...props} {...field.as("hidden", value)} />
  {/if}
{/snippet}

{#if showErrors}
  <Field {field}>
    {#snippet children({ errorProps, inputProps })}
      {@render input(inputProps)}

      <FieldErrors {...errorProps} />
    {/snippet}
  </Field>
{:else}
  {@render input({})}
{/if}
