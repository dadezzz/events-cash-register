<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { DialogButton, DialogContent, DialogRoot, getDialogContext } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { OrderClient } from "#lib/entities/cart/order/client/index.ts";
  import { deleteOrderForm } from "../_forms.remote.ts";

  interface Props {
    order: OrderClient;
  }

  const { order }: Props = $props();

  const form = $derived(deleteOrderForm.for(order.data.cartId));
</script>

<DialogRoot>
  {const dialogContext = getDialogContext()}

  <DialogButton>
    <TrashIcon class="size-4" />
  </DialogButton>

  <DialogContent>
    <div class="dialog-center dialog-inner" transition:fly>
      <Form
        {form}
        onresult={() => {
          dialogContext.open = false;
        }}
      >
        <HiddenInput field={form.fields.cartId} value={order.data.cartId} />

        <DialogButton>Annulla</DialogButton>
        <button type="submit">Conferma</button>
      </Form>
    </div>
  </DialogContent>
</DialogRoot>
