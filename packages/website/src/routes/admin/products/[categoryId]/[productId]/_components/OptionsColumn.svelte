<script lang="ts">
  import { ArrowLeftIcon, DotsThreeVerticalIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { PopoverAnchor, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover/index.ts";
  import type { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import type { ProductClient } from "#lib/entities/products/client/index.ts";
  import AddProductOptionDialog from "./add-product-option-dialog/AddProductOptionDialog.svelte";

  interface Props {
    category: ProductCategoryClient;
    product: ProductClient;
  }

  const { category, product }: Props = $props();

  const options = $derived(await product.getOptions());
</script>

<div class="border-mist-default flex gap-2 border-b p-2 font-bold">
  <a href="/admin/products/{category.data.id}" class="button-ghost p-1 text-mist-700 md:hidden dark:text-mist-300">
    <ArrowLeftIcon class="size-4" />
  </a>

  <h2 class="flex w-full gap-1 text-nowrap">
    <span>Opzioni</span>
    <span class="md:hidden">per {product.data.name}</span>
  </h2>

  <AddProductOptionDialog {product} />
</div>

<ol class="flex flex-col gap-2 overflow-y-auto p-2">
  {#each options as option, index (option.data.id)}
    <li class="flex shrink-0 justify-between overflow-hidden rounded-md">
      <div class="flex w-full items-center gap-2 p-2">
        <span class="text-mist-600 dark:text-mist-400">{index + 1}</span>
        <span>{option.data.name}</span>
      </div>

      <PopoverRoot>
        <PopoverAnchor class="flex">
          <PopoverButton
            aria-label="Opzioni"
            class="px-2 text-mist-600 hover:bg-mist-200 focus:bg-emerald-50 focus:outline-none dark:text-mist-400 dark:hover:bg-mist-800 dark:focus:bg-emerald-950"
          >
            <DotsThreeVerticalIcon class="size-5" />
          </PopoverButton>
        </PopoverAnchor>

        <PopoverContent class="anchored-bottom-span-left">
          <div class="popover-default p-2" transition:fly>
            <p>Modifica</p>
            <p>Elimina</p>
          </div>
        </PopoverContent>
      </PopoverRoot>
    </li>
  {/each}
</ol>
