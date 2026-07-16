<script lang="ts">
  import type { Snippet } from "svelte";
  import Dialog from "#components/Dialog.svelte";
  import AddCategoryForm from "./AddCategoryForm.svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <button type="button" {...props}>
      {@render children()}
    </button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="dialog-default">
      <AddCategoryForm
        onresult={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
