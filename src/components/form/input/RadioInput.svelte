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
  <div class="flex gap-2 items-center w-fit group">
    <div
      class="flex items-center justify-center group-hover:outline-2 outline-emerald-default size-4 border border-mist-strong group-has-[input:checked]/radio:border-emerald-700 dark:group-has-[input:checked]/radio:border-emerald-300 rounded-full"
    >
      <div
        class="size-2 group-has-[input:checked]/radio:bg-emerald-700 dark:group-has-[input:checked]/radio:bg-emerald-300 rounded-full"
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

<div>
  <!-- Setting flex on fieldset gives strange results, so we wrap in a div. -->
  <fieldset aria-describedby={field.issues()?.length ? `${id}-errors` : undefined} class="contents">
    <legend
      data-invalid={!!field.issues()?.length}
      class="text-sm text-mist-700 dark:text-mist-300 data-[invalid=true]:text-red-default"
    >
      {label}
    </legend>

    <div class={["mt-0.5 mb-2", entriesClass]}>
      {#each entries as entry (entry.value)}
        {@render wrappedEntryUI(entry)}
      {/each}
    </div>

    <FieldErrors id="{id}-errors" errors={field.issues()} />
  </fieldset>
</div>
