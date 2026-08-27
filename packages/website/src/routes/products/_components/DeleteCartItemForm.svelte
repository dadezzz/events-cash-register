<script lang="ts">
  import { XIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { HiddenInput } from "#components/form/input/index.ts";
  import type { CartItemClient } from "#lib/entities/cart/cart-item/client/index.ts";
  import { deleteCartItemForm } from "../_forms.remote.ts";

  interface Props {
    cartItem: CartItemClient;
  }

  const { cartItem }: Props = $props();

  const form = $derived(deleteCartItemForm.for(cartItem.data.id));
</script>

<Form {form}>
  <HiddenInput field={form.fields.id} value={cartItem.data.id} />

  <button type="submit">
    <XIcon class="text-red-default size-4" />
  </button>
</Form>
