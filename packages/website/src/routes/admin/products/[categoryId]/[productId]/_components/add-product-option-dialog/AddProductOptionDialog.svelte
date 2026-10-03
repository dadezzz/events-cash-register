<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import AddProductOptionForm from "./AddProductOptionForm.svelte";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();
</script>

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <DialogButton class="button-ghost p-1 text-mist-700 dark:text-mist-300">
    <PlusIcon class="size-4" />
  </DialogButton>

  <DialogContent>
    <div class="dialog-center flex max-h-screen">
      <div class="dialog-inner m-2 max-h-full max-w-md overflow-y-auto p-2" transition:fly>
        <h2 class="mb-2 text-xl font-bold">Aggiungi opzione</h2>

        <p class="mb-2">Le opzioni permettono di configurare il prodotto per adattarlo alle esigenze del cliente.</p>

        <AddProductOptionForm
          {product}
          onresult={() => {
            dialogContext.open = false;
          }}
        />
      </div>
    </div>
  </DialogContent>
</DialogRoot>
