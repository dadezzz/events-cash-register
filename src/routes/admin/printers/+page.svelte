<script lang="ts">
  import { Printer } from "#lib/entities/printer/client/index.ts";
  import PrinterForm from "./_components/PrinterForm.svelte";

  const printers = $derived(await Printer.getAll());
</script>

<ul>
  {#each printers as printer (printer.data.id)}
    <li><PrinterForm {printer} /></li>
  {/each}
</ul>
