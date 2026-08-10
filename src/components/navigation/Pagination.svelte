<script lang="ts">
  import { CaretLeftIcon, CaretRightIcon } from "phosphor-svelte";
  import { iteratorToNumber } from "#lib/array.ts";
  import { createPaginationUrl, type PaginationOptions } from "#lib/pagination.ts";
  import { page } from "$app/state";

  interface Props {
    options: PaginationOptions<string>;
    itemsCount: number;
  }

  const { options, itemsCount }: Props = $props();

  const firstPage = 1;
  const isFirstPage = $derived(options.page === firstPage);
  const lastPage = $derived(Math.ceil(itemsCount / options.pageSize) + 1);
  const isLastPage = $derived(options.page === lastPage);
</script>

<!-- Show pagination only if necessary. -->
{#if itemsCount > options.pageSize}
  <div class="flex items-center gap-1 font-semibold text-mist-600 dark:text-mist-400">
    <a
      aria-disabled={isFirstPage}
      href={!isFirstPage ? createPaginationUrl(page.url, { ...options, page: options.page - 1 }).href : undefined}
      class="button-ghost block rounded-md p-2 disabled:hover:bg-transparent"
    >
      <CaretLeftIcon weight="bold" class="size-4" />
    </a>

    {#each iteratorToNumber(firstPage, lastPage) as pageNumber}
      <a
        aria-disabled={options.page === pageNumber}
        aria-current={options.page === pageNumber}
        href={createPaginationUrl(page.url, { ...options, page: pageNumber }).href}
        class="button-ghost block p-1 px-3 aria-current:bg-emerald-50 dark:aria-current:bg-emerald-950"
      >
        {pageNumber}
      </a>
    {/each}

    <a
      aria-disabled={isLastPage}
      href={!isLastPage ? createPaginationUrl(page.url, { ...options, page: options.page + 1 }).href : undefined}
      class="button-ghost block rounded-md p-2 disabled:hover:bg-transparent"
    >
      <CaretRightIcon weight="bold" class="size-4" />
    </a>
  </div>
{/if}
