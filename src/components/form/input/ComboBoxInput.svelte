<script lang="ts">
  import { CaretUpDownIcon, CheckIcon } from "phosphor-svelte";
  import Popover from "#components/Popover.svelte";
  import type { InputProps } from ".";
  import Field from "./Field.svelte";
  import FieldErrors from "./FieldErrors.svelte";
  import FieldLabel from "./FieldLabel.svelte";
  import HiddenInput from "./HiddenInput.svelte";

  interface Entry {
    value: string;
    label: string;
  }

  interface Props extends InputProps<string> {
    // Default value to set when the input is rendered.
    value?: string;
    entries: Entry[];
  }

  const { field, label, value, entries }: Props = $props();

  // Used for faster retrieval of labels.
  const entriesMap = $derived(new Map(entries.map(({ value, label }) => [value, label])));

  // Set up the form with the default value passed.
  $effect.pre(() => {
    if (value) {
      field.set(value);
    }
  });

  const id = $props.id();
  let comboboxInput: HTMLInputElement | undefined = $state(undefined);

  let suggestionsOpen = $state(false);
  // Index of the currently selected or suggested entry.
  let suggestionsIndex = $state(0);
  // Entries filtered by the value of comboboxInput.
  let suggestions = $derived(entries);
</script>

<Field {field}>
  {#snippet children({ errorProps, inputProps, labelProps })}
    <div class="flex flex-col gap-2">
      <FieldLabel {...labelProps}>{label}</FieldLabel>

      <HiddenInput {field} value={field.value()} />

      <Popover bind:open={suggestionsOpen} autofocusContent={false} anchor={comboboxInput}>
        {#snippet trigger({ props })}
          <div
            class="border-mist-strong outline-emerald-default hover:border-emerald-strong flex gap-3 overflow-hidden rounded-md border transition-colors focus-within:outline-2"
          >
            <input
              {...inputProps}
              class="w-full border-none px-3 py-2 focus:outline-none"
              type="text"
              value={value ? entriesMap.get(value) : undefined}
              bind:this={comboboxInput}
              oninput={(e) => {
                suggestionsOpen = true;
                suggestionsIndex = 0;
                suggestions = entries.filter((n) =>
                  n.label.toLowerCase().includes(e.currentTarget.value.toLowerCase()),
                );
              }}
              onkeydown={(e) => {
                switch (e.key) {
                  case "ArrowUp": {
                    suggestionsOpen = true;

                    if (suggestions.length === 0) {
                      return;
                    }

                    suggestionsIndex = Math.max(0, suggestionsIndex - 1);
                    e.currentTarget.value = suggestions[suggestionsIndex].label;
                    break;
                  }
                  case "ArrowDown": {
                    suggestionsOpen = true;

                    if (suggestions.length === 0) {
                      return;
                    }

                    suggestionsIndex = Math.min(suggestions.length - 1, suggestionsIndex + 1);
                    e.currentTarget.value = suggestions[suggestionsIndex].label;
                    break;
                  }
                  case "Enter": {
                    // Prevent submitting the form.
                    e.preventDefault();

                    if (!suggestionsOpen || suggestions.length === 0) {
                      return;
                    }

                    field.set(suggestions[suggestionsIndex].value);
                    e.currentTarget.value = suggestions[suggestionsIndex].label;
                    break;
                  }
                  case "Tab": {
                    suggestionsOpen = false;

                    if (suggestions.length === 0) {
                      return;
                    }

                    field.set(suggestions[suggestionsIndex].value);
                    e.currentTarget.value = suggestions[suggestionsIndex].label;
                    break;
                  }
                  case "Escape": {
                    if (!suggestionsOpen) {
                      e.currentTarget.value = "";
                    }

                    suggestionsOpen = false;
                  }
                }
              }}
              role="combobox"
              aria-activedescendant={suggestionsOpen ? `${id}-option-${suggestions[suggestionsIndex]}` : undefined}
              aria-autocomplete="list"
              aria-controls="{id}-list"
              aria-expanded={suggestionsOpen}
              aria-haspopup="listbox"
            />

            <button
              {...props}
              type="button"
              aria-label="Open the list of options"
              tabindex={-1}
              class="px-3 py-2 text-mist-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 focus:outline-none dark:text-mist-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400 dark:focus:bg-emerald-950 dark:focus:text-emerald-400"
              onclick={() => {
                suggestionsOpen = !suggestionsOpen;
                // Keep focus on the input node. Entry selection is handled through
                // pressing the up and down arrow keys.
                comboboxInput?.focus();
                // When opening the popup through the button, show all suggestions.
                suggestions = entries;
              }}
            >
              <CaretUpDownIcon class="size-5" />
            </button>
          </div>
        {/snippet}
        {#snippet content({ props })}
          <div {...props} class="popover-default max-h-96 overflow-y-auto p-2 text-sm">
            <ul id="{id}-list">
              {#each suggestions as entry (entry.value)}
                <li id="{id}-option-{entry.value}">
                  <button
                    type="button"
                    data-selected={suggestions[suggestionsIndex].value === entry.value}
                    class="flex w-full cursor-pointer items-center justify-between gap-8 rounded-md p-2 transition-colors hover:bg-mist-200 focus:bg-mist-200 focus:outline-none not-group-focus-within:not-group-hover:data-[selected=true]:bg-mist-100 dark:hover:bg-mist-800 dark:focus:bg-mist-800 dark:not-group-focus-within:not-group-hover:data-[selected=true]:bg-mist-900"
                    onclick={() => {
                      field.set(entry.value);

                      if (comboboxInput) {
                        comboboxInput.value = entriesMap.get(entry.value) ?? "";
                      }

                      suggestionsOpen = false;
                    }}
                  >
                    <span>{entry.label}</span>

                    <CheckIcon
                      data-selected={suggestions[suggestionsIndex].value === entry.value}
                      class="size-4 opacity-0 transition-opacity data-[selected=true]:opacity-100"
                    />
                  </button>
                </li>
              {:else}
                <span class="text-mist-600 dark:text-mist-400">No entries found.</span>
              {/each}
            </ul>
          </div>
        {/snippet}
      </Popover>

      <FieldErrors {...errorProps} />
    </div>
  {/snippet}
</Field>
