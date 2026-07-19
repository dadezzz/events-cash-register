<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { ComboBoxInput, TextInput } from "#components/form/input/index.ts";
  import Header from "#components/Header.svelte";
  import Separator from "#components/Separator.svelte";
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import RootBlock from "./_components/RootBlock.svelte";
  import { createReceiptForm } from "./_forms.remote.ts";
  import { createReceiptSchema } from "./_schemas.ts";

  const form = createReceiptForm.preflight(createReceiptSchema);

  const printers = $derived(await PrinterClient.getAll());
</script>

<Header>
  <p>Ricevute e comande</p>
</Header>

<div class="min-h-0 grow overflow-y-auto p-2 flex flex-col gap-4">
  <Form {form} class="contents">
    <TextInput field={form.fields.name} label="Nome" />

    <ComboBoxInput
      field={form.fields.printerId}
      label="Stampante"
      entries={printers.map((p) => ({ label: p.data.name, value: p.data.id }))}
    />

    <Separator orientation="horizontal" class="border-mist-strong" />

    <h3 class="font-semibold text-xl">Template</h3>

    <div class="rounded-md bg-mist-100 dark:bg-mist-900 p-2">
      <RootBlock field={form.fields.blocks} />
    </div>

    <button type="submit" class="bg-emerald-500 px-2 py-1 rounded-md">Crea</button>
  </Form>
</div>
