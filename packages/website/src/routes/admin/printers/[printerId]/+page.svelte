<script lang="ts">
  import { ArrowLeftIcon, WarningIcon } from "phosphor-svelte";
  import Header from "#components/Header.svelte";
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import type { PrinterId } from "#lib/entities/printer/id.ts";
  import ColumnsLayout from "../_components/ColumnsLayout.svelte";
  import PrintersColumn from "../_components/PrintersColumn.svelte";
  import DeletePrinterDialog from "./_components/DeletePrinterDialog.svelte";
  import UpdatePrinterForm from "./_components/UpdatePrinterForm.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const printer = $derived(await PrinterClient.fromId(params.printerId as PrinterId));
  const receiptTemplates = $derived(await printer.getReceiptTemplates());
</script>

<svelte:head>
  <title>Configurazione stampanti | Cassa</title>
</svelte:head>

<Header>
  <h1>Configurazione stampanti</h1>
</Header>

<ColumnsLayout mainColumn="second">
  {#snippet firstColumn()}
    <PrintersColumn />
  {/snippet}
  {#snippet secondColumn()}
    <div class="border-mist-default flex gap-2 border-b p-2 font-bold">
      <a href="/admin/printers" class="button-ghost p-1 text-mist-700 md:hidden dark:text-mist-300">
        <ArrowLeftIcon class="size-4" />
      </a>

      <h2 class="flex w-full gap-1 text-nowrap">
        <span>Dettagli</span>
        <span class="md:hidden">per {printer.data.name}</span>
      </h2>
    </div>

    <div class="flex flex-col gap-4 overflow-y-auto p-2">
      <h3 class="text-xl font-bold not-md:hidden">{printer.data.name}</h3>

      <h4 class="font-semibold">Impostazioni</h4>

      <UpdatePrinterForm {printer} />

      <h4 class="font-semibold">Elimina</h4>

      {#if receiptTemplates.length > 0}
        <div
          class="flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 p-2 dark:border-yellow-700 dark:bg-yellow-950"
        >
          <WarningIcon class="mx-1 size-6 shrink-0 text-yellow-500 dark:text-yellow-500" />

          <div class="flex flex-col gap-2">
            <p>
              Ci sono ancora scontrini o comande associati con questa stampante. Prima di eliminarla è necessario
              spostarli o rimuoverli.
            </p>

            <ul>
              {#each receiptTemplates as receipt}
                <li class="list-inside list-disc">
                  <a href="/admin/receipts/{receipt.data.id}" class="underline hover:no-underline">
                    {receipt.data.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      {/if}

      <p>
        La stampante verrà eliminata dal database e non ri-apparirà fino a quando il server sarà in grado di connettersi
        nuovamente ad essa.
      </p>

      <DeletePrinterDialog disabled={receiptTemplates.length > 0} {printer} />
    </div>
  {/snippet}
</ColumnsLayout>
