<script lang="ts">
  import ColumnsLayout from "./_components/ColumnsLayout.svelte";
  import EmptyEditorColumn from "./_components/EmptyEditorColumn.svelte";
  import EmptyOptionsColumn from "./_components/EmptyOptionsColumn.svelte";
  import ReceiptsListColumn from "./_components/ReceiptsListColumn.svelte";
</script>

<ColumnsLayout mainColumn="first">
  {#snippet firstColumn()}
    <ReceiptsListColumn />
  {/snippet}
  {#snippet secondColumn()}
    <EmptyEditorColumn />
  {/snippet}
  {#snippet thirdColumn()}
    <EmptyOptionsColumn />
  {/snippet}
</ColumnsLayout>
