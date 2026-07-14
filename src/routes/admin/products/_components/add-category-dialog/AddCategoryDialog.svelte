<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "#components/controls/index.ts";
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
    <Button type="button" {...props} {children} />
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="bg-white dialog-centered">
      <AddCategoryForm
        onresult={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
