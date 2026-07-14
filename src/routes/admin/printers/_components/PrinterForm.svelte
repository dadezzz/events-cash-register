<script lang="ts">
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { ComboBoxInput, HiddenInput, NumericInput } from "#components/form/input/index.ts";
  import type { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import { updateSettingsForm } from "../_forms.remote.ts";
  import { updateSettingsFormSchema } from "../_schemas.ts";

  interface Props {
    printer: PrinterClient;
  }

  const { printer }: Props = $props();

  const availableSettings = $derived(await printer.getSettingsAvailable());
  const selectedSettings = $derived(await printer.getSettingsSelected());

  const settingLabels = {
    copies: "Numero di copie",
    finishings: "Finiture",
    printColorMode: "Modalità colori",
    media: "Formato carta",
  };

  const form = $derived(updateSettingsForm.for(printer.data.id).preflight(updateSettingsFormSchema));
</script>

<Form {form}>
  <HiddenInput field={form.fields.printerId} value={printer.data.id} />

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
        entries={setting.constraints.entries.map((e) => ({ value: e, label: e, }))}
        value={selectedValue?.value as string ?? setting.default}
      />
    {/if}
  {/each}

  <Button type="submit">Salva</Button>
</Form>
