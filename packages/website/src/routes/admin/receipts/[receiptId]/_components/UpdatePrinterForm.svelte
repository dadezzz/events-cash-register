<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { ComboBoxInput, HiddenInput, NumericInput } from "#components/form/input/index.ts";
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import type { PrinterReceiptTemplateClient } from "#lib/entities/printer/receipt-template/client/index.ts";
  import { updatePrinterForm } from "../_forms.remote.ts";
  import { updatePrinterFormSchema } from "../_schemas.ts";

  interface Props {
    receipt: PrinterReceiptTemplateClient;
  }

  const { receipt }: Props = $props();

  const printers = $derived(await PrinterClient.getAll());
  const selectedPrinter = $derived(await PrinterClient.fromId(receipt.data.printerId));

  const availableSettings = $derived(await selectedPrinter.getSettingsAvailable());
  const selectedSettings = $derived(await receipt.getPrinterSettingsSelected());

  const settingLabels = {
    copies: "Numero di copie",
    finishings: "Finiture",
    printColorMode: "Modalità colori",
    media: "Formato carta",
  };

  const form = $derived(updatePrinterForm.preflight(updatePrinterFormSchema));
</script>

<Form {form} class="flex flex-col gap-2">
  <HiddenInput field={form.fields.id} value={receipt.data.id} />

  <ComboBoxInput
    field={form.fields.printerId}
    label="Stampante"
    value={receipt.data.printerId}
    entries={printers.map((p) => ({ label: p.data.name, value: p.data.id }))}
  />

  {#each availableSettings as setting, i (setting.name)}
    {@const selectedValue = selectedSettings.find((se) => se.name === setting.name)}

    <HiddenInput field={form.fields.settings[i].name} value={setting.name} />

    {#if setting.type === "number"}
      <NumericInput
        // @ts-expect-error: Bad types :/
        field={form.fields.settings[i].sValue}
        label={settingLabels[setting.name]}
        value={selectedValue?.value ?? setting.default}
      />
    {:else if setting.type === "string"}
      <ComboBoxInput
        // @ts-expect-error: Bad types :/
        field={form.fields.settings[i].sValue}
        label={settingLabels[setting.name]}
        entries={setting.constraints.entries.map((e) => ({ value: e, label: e }))}
        value={(selectedValue?.value as string) ?? setting.default}
      />
    {/if}
  {/each}

  <button type="submit" class="button-primary mt-2 px-2 py-1">Salva</button>
</Form>
