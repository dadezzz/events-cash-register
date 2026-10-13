<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import { getPopoverContext, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import type { PrinterReceiptTemplateClient } from "#lib/entities/printer/receipt-template/client/index.ts";
  import { deleteReceiptForm as form } from "../_forms.remote.ts";

  interface Props {
    receipt: PrinterReceiptTemplateClient;
  }

  const { receipt }: Props = $props();
</script>

<PopoverRoot type="auto">
  {const popoverContext = getPopoverContext()}

  <PopoverButton
    class="button-primary-red px-2 py-1 disabled:bg-mist-200 disabled:text-mist-600 dark:disabled:bg-mist-800 dark:disabled:text-mist-400"
  >
    Elimina
  </PopoverButton>

  <PopoverContent
    usePortal
    class="popover-floating-center popover-content popover-backdrop popover-floating-border flex flex-col gap-2 p-2"
  >
    <h2 class="text-xl font-semibold">Elimina comanda/ricevuta</h2>

    <p>Conferma di voler eliminare {receipt.data.name}</p>

    <Form
      {form}
      onresult={() => {
        popoverContext.open = false;
      }}
    >
      <HiddenInput field={form.fields.id} value={receipt.data.id} />

      <div class="flex justify-end gap-2">
        <PopoverButton class="button-secondary px-2 py-1">Annulla</PopoverButton>
        <button type="submit" class="button-primary-red px-2 py-1">Conferma</button>
      </div>
    </Form>
  </PopoverContent>
</PopoverRoot>
