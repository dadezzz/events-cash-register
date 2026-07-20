<script lang="ts">
  import { Popover } from "bits-ui";
  import { DotsThreeVerticalIcon } from "phosphor-svelte";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";

  interface Props {
    product: ProductClient;
  }

  const { product }: Props = $props();

  const options = $derived(await product.getOptions());
</script>

<ol>
  {#each options as option, i (option.data.id)}
    <li class="flex justify-between border-t border-slate-200 py-2 last:border-b">
      <div class="flex gap-2">
        <span class="text-slate-400">{i + 1}</span>
        <span>{option.data.name}</span>
      </div>

      <Popover.Root>
        <Popover.Trigger class="px-1">
          <DotsThreeVerticalIcon />
        </Popover.Trigger>
        <Popover.Content class="z-40 rounded-md border border-slate-100 bg-white p-4 shadow">
          <Popover.Arrow class="text-slate-100 " />

          <p>Modify order</p>
          <p>Edit</p>
          <p>Delete</p>
        </Popover.Content>
      </Popover.Root>
    </li>
  {/each}
</ol>
