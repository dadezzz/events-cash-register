<script lang="ts" generics="L">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import FieldErrors from "./FieldErrors.svelte";
  import type { InputProps } from "./index.ts";

  interface Entry {
    value: string;
    label: L;
  }

  interface Props extends InputProps<string> {
    // Default value
    value?: string;
    /**
     * @member value Is what will be put in the input field and sent with the form submission.
     * @member label Will be passed to entryUI and can be used for rendering a nicer UI.
     */
    entries: Entry[];
    /** Used to render a single choice of the radio input. */
    entryUI?: Snippet<[{ checked: boolean; label: L }]>;
    /** Classes for the default entriesUI implementation. */
    entriesClass?: ClassValue;
  }

  const { field, label, value, entries, entryUI, entriesClass }: Props = $props();

  const id = $props.id();

  $effect.pre(() => {
    if (value) {
      field.set(value);
    }
  });
</script>

{#snippet defaultEntryUI(entry: Entry)}
  <div class="group flex w-fit items-center gap-2">
    <div
      class="outline-emerald-default border-mist-strong flex size-4 items-center justify-center rounded-full border group-focus-within/radio:outline-2 group-hover:outline-2 group-has-[input:checked]/radio:border-emerald-700 dark:group-has-[input:checked]/radio:border-emerald-300"
    >
      <div
        class="size-2 rounded-full group-has-[input:checked]/radio:bg-emerald-700 dark:group-has-[input:checked]/radio:bg-emerald-300"
      ></div>
    </div>

    <span class="text-mist-700 dark:text-mist-300">{entry.label}</span>
  </div>
{/snippet}

<!--
  Renders the card that the user provided but wrapped with a RadioGroup.Item
-->
{#snippet wrappedEntryUI(entry: Entry)}
  <div class="group/radio">
    <input id="{id}-values-{entry.value}" {...field.as("radio", entry.value)} class="sr-only" />

    <!-- To style children use the prefix group-has-[input:checked]/radio: -->
    <!-- biome-ignore lint/a11y/noLabelWithoutControl: There is a for attribute :| -->
    <label for="{id}-values-{entry.value}">
      {#if entryUI}
        {@render entryUI({ checked: field.value() === entry.value, label: entry.label })}
      {:else}
        {@render defaultEntryUI(entry)}
      {/if}
    </label>
  </div>
{/snippet}

<fieldset aria-describedby={field.issues()?.length ? `${id}-errors` : undefined}>
  <legend
    data-invalid={!!field.issues()?.length}
    class="data-[invalid=true]:text-red-default text-sm text-mist-700 dark:text-mist-300"
  >
    {label}
  </legend>

  <!-- Fieldset is a special element and doesn't support flexbox.  -->
  <div class="mt-1 flex flex-col gap-2">
    <div class={entriesClass}>
      {#each entries as entry (entry.value)}
        {@render wrappedEntryUI(entry)}
      {/each}
    </div>

    <FieldErrors id="{id}-errors" errors={field.issues()} />
  </div>
</fieldset>
