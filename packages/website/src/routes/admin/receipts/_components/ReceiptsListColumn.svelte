<script lang="ts">
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import { PrinterReceiptTemplateClient } from "#lib/entities/printer/receipt-template/client/index.ts";
  import { page } from "$app/state";
  import AddReceiptDialog from "./AddReceiptDialog.svelte";

  const receipts = $derived(await PrinterReceiptTemplateClient.getAll());
</script>

<div class="border-mist-default flex justify-between border-b p-2 font-bold">
  <h2>Elenco</h2>
  <AddReceiptDialog />
</div>

<ol class="flex flex-col gap-2 overflow-y-auto p-2">
  {#each receipts as receipt (receipt.data.id)}
    {const printer = $derived(await PrinterClient.fromId(receipt.data.printerId))}

    <li>
      <a
        href="/admin/receipts/{receipt.data.id}"
        aria-current={page.url.pathname.startsWith(`/admin/receipts/${receipt.data.id}`)}
        class="outline-emerald-default flex w-full items-center gap-2 rounded-md p-2 hover:bg-mist-200 focus:bg-emerald-50 focus:outline-none not-focus:aria-current:bg-mist-100 dark:hover:bg-mist-800 dark:focus:bg-emerald-950 not-focus:dark:aria-current:bg-mist-900"
      >
        <span>{receipt.data.name}</span>
        <span class="text-mist-600 dark:text-mist-400">({printer.data.name})</span>
      </a>
    </li>
  {/each}
</ol>
