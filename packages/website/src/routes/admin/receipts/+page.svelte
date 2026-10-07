<script lang="ts">
  import ColumnsLayout from "./_components/ColumnsLayout.svelte";
  import EmptyEditorColumn from "./_components/EmptyEditorColumn.svelte";
  import ReceiptsListColumn from "./_components/ReceiptsListColumn.svelte";
</script>

<ColumnsLayout mainColumn="first">
  {#snippet firstColumn()}
    <ReceiptsListColumn />
  {/snippet}
  {#snippet secondColumn()}
    <EmptyEditorColumn />
  {/snippet}
</ColumnsLayout>
