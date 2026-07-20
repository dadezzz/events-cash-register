<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { OrderClient } from "#lib/entities/cart/order/client/index.ts";
  import { deleteOrderForm } from "../_forms.remote";

  interface Props {
    order: OrderClient;
    onresult: () => void;
    oncancel: () => void;
  }

  const { order, oncancel, onresult }: Props = $props();

  const form = $derived(deleteOrderForm.for(order.data.cartId));
</script>

<Form {form} {onresult}>
  <HiddenInput field={form.fields.cartId} value={order.data.cartId} />

  <button type="button" onclick={oncancel}>Annulla</button>

  <button type="submit">Conferma</button>
</Form>
