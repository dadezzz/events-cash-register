<script lang="ts">
  import { ArrowLeftIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { PrinterReceiptTemplateClient } from "#lib/entities/printer/receipt-template/client/index.ts";
  import type { PrinterReceiptTemplateId } from "#lib/entities/printer/receipt-template/id.ts";
  import ColumnsLayout from "../../_components/ColumnsLayout.svelte";
  import ReceiptsListColumn from "../../_components/ReceiptsListColumn.svelte";
  import RootBlock from "../../_components/RootBlock.svelte";
  import { updateBlocksForm } from "./_forms.remote.ts";
  import { updateBlocksFormSchema } from "./_schemas.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const receipt = $derived(await PrinterReceiptTemplateClient.fromId(params.receiptId as PrinterReceiptTemplateId));

  const form = updateBlocksForm.preflight(updateBlocksFormSchema);
</script>

<ColumnsLayout mainColumn="second">
  {#snippet firstColumn()}
    <ReceiptsListColumn />
  {/snippet}
  {#snippet secondColumn()}
    <div class="border-mist-default flex gap-2 border-b p-2 font-bold">
      <a href="/admin/receipts/{receipt.data.id}" class="button-ghost p-1 text-mist-700 dark:text-mist-300">
        <ArrowLeftIcon class="size-4" />
      </a>

      <span>Template</span>
    </div>

    <div class="overflow-y-auto">
      <Form {form} class="flex min-h-0 grow flex-col gap-4 overflow-y-auto p-2">
        <div class="rounded-md bg-mist-100 p-2 dark:bg-mist-900">
          <RootBlock field={form.fields.blocks} />
        </div>

        <button type="submit" class="button-primary mt-2 px-2 py-1">Salva</button>
      </Form>
    </div>
  {/snippet}
</ColumnsLayout>
