<script lang="ts">
  import { Popover } from "bits-ui";
  import { DotsThreeVerticalIcon } from "phosphor-svelte";
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";

  const printers = $derived(await PrinterClient.getAll());
</script>

<ul>
  {#each printers as printer, i (printer.data.id)}
    <li class="flex justify-between border-t border-slate-200 py-2 last:border-b">
      <a href="/admin/printers/{printer.data.id}" class="flex items-center gap-2">
        <span>{printer.data.name}</span>

        {#if printer.data.available}
          <span class="size-2 rounded-full bg-green-500"></span>
        {/if}
      </a>

      <Popover.Root>
        <Popover.Trigger class="px-1">
          <DotsThreeVerticalIcon />
        </Popover.Trigger>
        <Popover.Content class="z-40 rounded-md border border-slate-100 bg-white p-4 shadow">
          <Popover.Arrow class="text-slate-100 " />

          <p>Delete</p>
        </Popover.Content>
      </Popover.Root>
    </li>
  {/each}
</ul>
