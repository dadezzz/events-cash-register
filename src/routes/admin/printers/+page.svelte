<script lang="ts">
  import PageWithSidebar from "#components/layouts/PageWithSidebar.svelte";
  import PrintersList from "./_components/PrintersList.svelte";
</script>

<PageWithSidebar>
  <div class="flex h-full">
    <div class="w-full p-2">
      <h2 class="font-bold flex mb-2">Stampanti</h2>

      <PrintersList />
    </div>

    <div class="md:block border-l border-slate-300 hidden w-full p-2">
      <h2 class="font-bold">Opzioni</h2>

      <div class="flex h-full items-center justify-center">Seleziona una stampante</div>
    </div>
  </div>
</PageWithSidebar>
