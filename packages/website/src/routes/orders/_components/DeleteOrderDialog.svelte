<script lang="ts">
  import { TrashIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import { getPopoverContext, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import type { OrderClient } from "#lib/entities/cart/order/client/index.ts";
  import { deleteOrderForm } from "../_forms.remote.ts";

  interface Props {
    order: OrderClient;
  }

  const { order }: Props = $props();

  const form = $derived(deleteOrderForm.for(order.data.cartId));
</script>

<PopoverRoot type="auto">
  {const popoverContext = getPopoverContext()}

  <PopoverButton>
    <TrashIcon class="size-4" />
  </PopoverButton>

  <PopoverContent
    usePortal
    class="popover-backdrop popover-floating-center popover-content popover-floating-border p-2"
  >
    <Form
      {form}
      onresult={() => {
        popoverContext.open = false;
      }}
    >
      <HiddenInput field={form.fields.cartId} value={order.data.cartId} />

      <PopoverButton>Annulla</PopoverButton>
      <button type="submit">Conferma</button>
    </Form>
  </PopoverContent>
</PopoverRoot>
