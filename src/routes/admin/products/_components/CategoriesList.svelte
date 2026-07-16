<script lang="ts">
  import { Popover } from "bits-ui";
  import { DotsThreeVerticalIcon } from "phosphor-svelte";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";

  const categories = $derived(await ProductCategoryClient.getAll());
</script>

<ol>
  {#each categories as category, i (category.data.id)}
    <li class="flex justify-between border-t last:border-b border-slate-200 py-2">
      <a href="/admin/products/{category.data.id}" class="flex gap-2">
        <span class="text-slate-400">{i + 1}</span>
        <span>{category.data.name}</span>
      </a>

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
