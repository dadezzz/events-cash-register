<script lang="ts">
  import { fly } from "svelte/transition";
  import Dialog from "#components/Dialog.svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import { deletePrinterForm } from "../_forms.remote";

  interface Props {
    disabled: boolean;
    printer: PrinterClient;
  }

  const { disabled, printer }: Props = $props();

  const form = $derived(deletePrinterForm.for(printer.data.id));
  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button
      type="button"
      {...props}
      {disabled}
      class="button-primary-red px-2 py-1 disabled:bg-mist-200 disabled:text-mist-600 dark:disabled:bg-mist-800 dark:disabled:text-mist-400"
    >
      Elimina
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-center dialog-inner flex flex-col gap-2 p-2" transition:fly>
      <h2 class="text-xl font-semibold">Elimina stampante</h2>

      <p>Conferma di voler eliminare la stampante <span class="font-semibold select-all">{printer.data.name}</span>.</p>

      <Form
        {form}
        onresult={() => {
          dialogOpen = false;
        }}
      >
        <HiddenInput field={form.fields.id} value={printer.data.id} />

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="button-secondary px-2 py-1"
            onclick={() => {
              dialogOpen = false;
            }}
          >
            Annulla
          </button>
          <button type="submit" class="button-primary-red px-2 py-1">Conferma</button>
        </div>
      </Form>
    </div>
  {/snippet}
</Dialog>
