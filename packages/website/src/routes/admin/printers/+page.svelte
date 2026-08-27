<script lang="ts">
  import Header from "#components/Header.svelte";
  import ColumnsLayout from "./_components/ColumnsLayout.svelte";
  import EmptyDetailsColumn from "./_components/EmptyDetailsColumn.svelte";
  import PrintersColumn from "./_components/PrintersColumn.svelte";
</script>

<svelte:head>
  <title>Configurazione stampanti | Cassa</title>
</svelte:head>

<Header>
  <h1>Configurazione stampanti</h1>
</Header>

<ColumnsLayout mainColumn="first">
  {#snippet firstColumn()}
    <PrintersColumn />
  {/snippet}
  {#snippet secondColumn()}
    <EmptyDetailsColumn />
  {/snippet}
</ColumnsLayout>
