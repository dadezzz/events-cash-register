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
  <div class="md:flex list-column">
    <h2 class="font-bold flex mb-2">Stampanti</h2>

    <PrintersList />
  </div>

  <div class="flex list-column">
    <h2 class="font-bold">Opzioni</h2>

    <div class="max-w-md my-2">
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
