<script lang="ts">
  import { Printer } from "#lib/entities/printer/client/index.ts";

  const printers = $derived(await Printer.getAll());
</script>

<ul>
  {#each printers as printer}
    <li>{printer.data.name} - {printer.data.available}</li>
  {/each}
</ul>
