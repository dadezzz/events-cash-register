<script lang="ts">
  import Header from "#components/Header.svelte";
  import PrintersList from "./_components/PrintersList.svelte";
</script>

<Header />

<div class="flex h-full">
  <div class="list-column flex">
    <h2 class="mb-2 flex font-bold">Stampanti</h2>

    <PrintersList />
  </div>

  <div class="list-column hidden md:flex">
    <h2 class="font-bold">Opzioni</h2>

    <div class="flex h-full items-center justify-center">Seleziona una stampante</div>
  </div>
</div>

<style>
  @reference "#assets/tailwind.css";

  .list-column {
    @apply w-full flex-col border-slate-300 p-2 not-first:border-l;
  }
</style>
