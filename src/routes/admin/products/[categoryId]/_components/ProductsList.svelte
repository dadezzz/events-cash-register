<script lang="ts">
  import { Popover } from "bits-ui";
  import { DotsThreeVerticalIcon } from "phosphor-svelte";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";

  interface Props {
    category: ProductCategoryClient;
  }

  const { category }: Props = $props();

  const products = $derived(await category.getProducts());
</script>

<ol>
  {#each products as product, i (product.data.id)}
    <li class="flex justify-between border-t border-slate-200 py-2 last:border-b">
      <a href="/admin/products/{category.data.id}/{product.data.id}" class="flex gap-2">
        <span class="text-slate-400">{i + 1}</span>
        <span>{product.data.name}</span>
      </a>

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
