<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import { Dialog } from "#components/dialog/index.ts";
  import AddProductForm from "./AddProductForm.svelte";

  let dialogOpen = $state(false);
</script>

<Dialog bind:open={dialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} class="font-bold bg-black text-white flex items-center gap-2 p-1 px-3 rounded-md">
      <PlusIcon class="size-5" />
      <span>Nuovo</span>
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="fixed top-1/2 left-1/2 -translate-1/2 bg-white z-50">
      <AddProductForm
        onresult={() => {
          dialogOpen = false;
        }}
      />
    </div>
  {/snippet}
</Dialog>
