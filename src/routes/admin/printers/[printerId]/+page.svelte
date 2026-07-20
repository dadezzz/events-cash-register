<script lang="ts">
  import Header from "#components/Header.svelte";
  import { PrinterClient } from "#lib/entities/printer/client/index.ts";
  import type { PrinterId } from "#lib/entities/printer/id.ts";
  import PrinterForm from "../_components/PrinterForm.svelte";
  import PrintersList from "../_components/PrintersList.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const printer = $derived(await PrinterClient.fromId(params.printerId as PrinterId));
</script>

<Header />

<div class="flex h-full">
  <div class="list-column md:flex">
    <h2 class="mb-2 flex font-bold">Stampanti</h2>

    <PrintersList />
  </div>

  <div class="list-column flex">
    <h2 class="font-bold">Opzioni</h2>

    <div class="my-2 max-w-md">
      <PrinterForm {printer} />
    </div>
  </div>
</div>

<style>
  @reference "#assets/tailwind.css";

  .list-column {
    @apply w-full flex-col border-slate-300 p-2 not-first:border-l;
  }
</style>
