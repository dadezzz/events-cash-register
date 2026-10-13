<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import { getPopoverContext, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import type { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import { deletePrinterForm } from "../_forms.remote";

  interface Props {
    disabled: boolean;
    printer: PrinterClient;
  }

  const { disabled, printer }: Props = $props();

  const form = $derived(deletePrinterForm.for(printer.data.id));
</script>

<PopoverRoot type="auto">
  {const popoverContext = getPopoverContext()}

  <PopoverButton
    {disabled}
    class="button-primary-red px-2 py-1 disabled:bg-mist-200 disabled:text-mist-600 dark:disabled:bg-mist-800 dark:disabled:text-mist-400"
  >
    Elimina
  </PopoverButton>

  <PopoverContent
    usePortal
    class="popover-floating-center popover-backdrop popover-floating-border popover-content flex flex-col gap-2 p-2"
  >
    <h2 class="text-xl font-semibold">Elimina stampante</h2>

    <p>Conferma di voler eliminare la stampante <span class="font-semibold select-all">{printer.data.name}</span>.</p>

    <Form
      {form}
      onresult={() => {
        popoverContext.open = false;
      }}
    >
      <HiddenInput field={form.fields.id} value={printer.data.id} />

      <div class="flex justify-end gap-2">
        <PopoverButton class="button-secondary px-2 py-1">Annulla</PopoverButton>
        <button type="submit" class="button-primary-red px-2 py-1">Conferma</button>
      </div>
    </Form>
  </PopoverContent>
</PopoverRoot>
