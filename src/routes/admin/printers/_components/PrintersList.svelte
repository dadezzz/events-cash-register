<script lang="ts">
  import { Popover } from "bits-ui";
  import { DotsThreeVerticalIcon } from "phosphor-svelte";
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";

  const printers = $derived(await PrinterClient.getAll());
</script>

<ul>
  {#each printers as printer, i (printer.data.id)}
    <li class="flex justify-between border-t last:border-b border-slate-200 py-2">
      <a href="/admin/printers/{printer.data.id}" class="flex gap-2 items-center">
        <span>{printer.data.name}</span>

        {#if printer.data.available}
          <span class="rounded-full size-2 bg-green-500"></span>
        {/if}
      </a>

      <Popover.Root>
        <Popover.Trigger class="px-1">
          <DotsThreeVerticalIcon />
        </Popover.Trigger>
        <Popover.Content class="bg-white z-40 border-slate-100 border rounded-md shadow p-4">
          <Popover.Arrow class="text-slate-100 " />

          <p>Delete</p>
        </Popover.Content>
      </Popover.Root>
    </li>
  {/each}
</ul>
