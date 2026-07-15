<script lang="ts">
  import { Popover } from "bits-ui";
  import { DotsThreeVerticalIcon } from "phosphor-svelte";
  import { A } from "#components/controls/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";

  interface Props {
    category: ProductCategoryClient;
  }

  const { category }: Props = $props();

  const products = $derived(await category.getProducts());
</script>

<ol>
  {#each products as product, i (product.data.id)}
    <li class="flex justify-between border-t last:border-b border-slate-200 py-2">
      <A href="/admin/products/{category.data.id}/{product.data.id}" class="flex gap-2">
        <span class="text-slate-400">{i + 1}</span>
        <span>{product.data.name}</span>
      </A>

      <Popover.Root>
        <Popover.Trigger class="px-1">
          <DotsThreeVerticalIcon />
        </Popover.Trigger>
        <Popover.Content class="bg-white z-40 border-slate-100 border rounded-md shadow p-4">
          <Popover.Arrow class="text-slate-100 " />

          <p>Modify order</p>
          <p>Edit</p>
          <p>Delete</p>
        </Popover.Content>
      </Popover.Root>
    </li>
  {/each}
</ol>
