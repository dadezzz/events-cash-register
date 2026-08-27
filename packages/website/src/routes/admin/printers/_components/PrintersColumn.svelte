<script lang="ts">
  import Chip from "#components/Chip.svelte";
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import { page } from "$app/state";

  const printers = $derived(await PrinterClient.getAll());
</script>

<h2 class="border-mist-default border-b p-2 font-bold">Stampanti</h2>

<ol class="flex flex-col gap-2 overflow-y-auto p-2">
  {#each printers as printer (printer.data.id)}
    <li>
      <a
        href="/admin/printers/{printer.data.id}"
        aria-current={page.url.pathname.startsWith(`/admin/printers/${printer.data.id}`)}
        class="outline-emerald-default flex w-full items-center gap-2 rounded-md p-2 hover:bg-mist-200 focus:bg-emerald-50 focus:outline-none not-focus:aria-current:bg-mist-100 dark:hover:bg-mist-800 dark:focus:bg-emerald-950 not-focus:dark:aria-current:bg-mist-900"
      >
        {printer.data.name}
        <Chip color="success">Connessa</Chip>
      </a>
    </li>
  {/each}
</ol>
