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
    entryUI: Snippet<[{ checked: boolean; label: L }]>;
    /** Used to define the layout where the entries will be rendered. */
    entriesUI?: Snippet<[{ wrappedEntryUI: typeof wrappedEntryUI; entries: typeof entries }]>;
    /** Classes for the div element wrapping the entry. */
    entryClass?: ClassValue;
    /** Classes for the default entriesUI implementation. */
    entriesClass?: ClassValue;
  }

  const { field, label, value, entries, entryUI, entriesUI, entryClass, entriesClass }: Props = $props();

  const id = $props.id();

  $effect.pre(() => {
    if (value) {
      field.set(value);
    }
  });
</script>

<!--
  Renders the card that the user provided but wrapped with a RadioGroup.Item
-->
{#snippet wrappedEntryUI(entry: Entry)}
  <div class={["group/radio", entryClass]}>
    <input
      id="{id}-values-{entry.value}"
      {...field.as("radio", entry.value)}
      checked={value === entry.value}
      class="sr-only"
    />

    <label for="{id}-values-{entry.value}">
      {@render entryUI({ checked: field.value() === entry.value, label: entry.label })}
    </label>
  </div>
{/snippet}

<div class="flex flex-col gap-2">
  <!-- Setting flex on fieldset gives strange results. -->
  <fieldset aria-describedby={field.issues()?.length ? `${id}-errors` : undefined} class="contents">
    <legend data-invalid={!!field.issues()?.length} class="text-sm text-slate-500 data-[invalid=true]:text-red-700">
      {label}
    </legend>

    {#if entriesUI}
      {@render entriesUI({ wrappedEntryUI, entries })}
    {:else}
      <div class={entriesClass}>
        {#each entries as entry (entry.value)}
          {@render wrappedEntryUI(entry)}
        {/each}
      </div>
    {/if}

    <FieldErrors id="{id}-errors" errors={field.issues()} />
  </fieldset>
</div>
