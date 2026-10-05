<script lang="ts">
  import { ArrowLeftIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { ComboBoxInput, TextInput } from "#components/form/input/index.ts";
  import Separator from "#components/Separator.svelte";
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import ColumnsLayout from "../_components/ColumnsLayout.svelte";
  import EmptyOptionsColumn from "../_components/EmptyOptionsColumn.svelte";
  import ReceiptsListColumn from "../_components/ReceiptsListColumn.svelte";
  import RootBlock from "../_components/RootBlock.svelte";
  import { updateBlocksForm, updateOptionsForm } from "../_forms.remote.ts";
  import { updateBlocksFormSchema, updateOptionsFormSchema } from "../_schemas.ts";

  const printers = $derived(await PrinterClient.getAll());

  const optionsForm = updateOptionsForm.preflight(updateOptionsFormSchema);
  const blocksForm = updateBlocksForm.preflight(updateBlocksFormSchema);
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

      <span>Editor</span>
    </div>

    <div class="overflow-y-auto">
      <div class="flex flex-col gap-4 p-2">
        <h3 class="font-semibold">Dati</h3>

        <Form form={optionsForm} class="contents">
          <TextInput field={optionsForm.fields.name} label="Nome" />

          <ComboBoxInput
            field={optionsForm.fields.printerId}
            label="Stampante"
            entries={printers.map((p) => ({ label: p.data.name, value: p.data.id }))}
          />

          <button type="submit" class="button-primary mt-2 px-2 py-1">Salva</button>
        </Form>
      </div>

      <Separator orientation="horizontal" class="border-mist-default" />

      <div class="flex flex-col gap-4 p-2">
        <h3 class="font-semibold">Template</h3>

        <Form form={blocksForm} class="flex min-h-0 grow flex-col gap-4 overflow-y-auto p-2">
          <div class="rounded-md bg-mist-100 p-2 dark:bg-mist-900">
            <RootBlock field={blocksForm.fields.blocks} />
          </div>

          <button type="submit" class="button-primary mt-2 px-2 py-1">Salva</button>
        </Form>
      </div>
    </div>
  {/snippet}
  {#snippet thirdColumn()}
    <EmptyOptionsColumn />
  {/snippet}
</ColumnsLayout>
