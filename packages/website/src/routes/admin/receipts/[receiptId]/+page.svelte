<script lang="ts">
  import { ArrowLeftIcon, ArrowRightIcon } from "phosphor-svelte";
  import { PrinterReceiptTemplateClient } from "#lib/entities/printer/receipt-template/client/index.ts";
  import type { PrinterReceiptTemplateId } from "#lib/entities/printer/receipt-template/id.ts";
  import ColumnsLayout from "../_components/ColumnsLayout.svelte";
  import ReceiptsListColumn from "../_components/ReceiptsListColumn.svelte";
  import DeleteReceiptDialog from "./_components/DeleteReceiptDialog.svelte";
  import UpdatePrinterForm from "./_components/UpdatePrinterForm.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const receipt = $derived(await PrinterReceiptTemplateClient.fromId(params.receiptId as PrinterReceiptTemplateId));
</script>

<ColumnsLayout mainColumn="second">
  {#snippet firstColumn()}
    <ReceiptsListColumn />
  {/snippet}
  {#snippet secondColumn()}
    <div class="border-mist-default flex gap-2 border-b p-2 font-bold">
      <a href="/admin/receipts" class="button-ghost p-1 text-mist-700 md:hidden dark:text-mist-300">
        <ArrowLeftIcon class="size-4" />
      </a>

      <span>Configurazione</span>
    </div>

    <div class="overflow-y-auto">
      <div class="flex flex-col gap-4 p-2">
        <!-- <h3 class="font-semibold">Identificazione</h3>

          <TextInput field={printerForm.fields.name} label="Nome" value={receipt.data.name} /> -->

        <h3 class="font-semibold">Stampante</h3>

        <UpdatePrinterForm {receipt} />

        <h3 class="font-semibold">Template</h3>

        <a
          href="/admin/receipts/{receipt.data.id}/template"
          class="button-primary mt-2 flex items-center justify-center gap-2 px-2 py-1"
        >
          <span>Modifica template</span>
          <ArrowRightIcon class="size-5" />
        </a>

        <h3 class="font-semibold">Elimina</h3>

        <DeleteReceiptDialog {receipt} />
      </div>
    </div>
  {/snippet}
</ColumnsLayout>
