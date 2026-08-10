<script lang="ts">
  import Header from "#components/Header.svelte";
  import ColumnsLayout from "./_components/ColumnsLayout.svelte";
  import EmptyUsersColumn from "./_components/EmptyUsersColumn.svelte";
  import UsersColumn from "./_components/UsersColumn.svelte";
</script>

<svelte:head>
  <title>Configurazione utenti | Cassa</title>
</svelte:head>

<Header>
  <h1>Configurazione utenti</h1>
</Header>

<ColumnsLayout mainColumn="first">
  {#snippet firstColumn()}
    <UsersColumn />
  {/snippet}
  {#snippet secondColumn()}
    <EmptyUsersColumn />
  {/snippet}
</ColumnsLayout>
