<script lang="ts">
  import { DotsThreeVerticalIcon } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { PopoverButton, PopoverContent, PopoverRoot } from "#components/popover/index.ts";
  import PopoverAnchor from "#components/popover/PopoverAnchor.svelte";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";
  import { page } from "$app/state";
  import AddCategoryDialog from "./AddCategoryDialog.svelte";

  const categories = $derived(await ProductCategoryClient.getAll());
</script>

<div class="border-mist-default flex justify-between border-b p-2 font-bold">
  <h2>Categorie</h2>
  <AddCategoryDialog />
</div>

<ol class="flex flex-col gap-2 overflow-y-auto p-2">
  {#each categories as category, index (category.data.id)}
    <li class="flex shrink-0 justify-between overflow-hidden rounded-md">
      <a
        href="/admin/products/{category.data.id}"
        aria-current={page.url.pathname.startsWith(`/admin/products/${category.data.id}`)}
        class="outline-emerald-default flex w-full items-center gap-2 p-2 hover:bg-mist-200 focus:bg-emerald-50 focus:outline-none not-focus:aria-current:bg-mist-100 dark:hover:bg-mist-800 dark:focus:bg-emerald-950 not-focus:dark:aria-current:bg-mist-900"
      >
        <span class="text-mist-600 dark:text-mist-400">{index + 1}</span>
        <span>{category.data.name}</span>
      </a>

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
