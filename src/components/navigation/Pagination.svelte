<script lang="ts">
  import { Pagination } from "bits-ui";
  import { CaretLeftIcon, CaretRightIcon } from "phosphor-svelte";
  import { createPaginationUrl, type PaginationOptions } from "#lib/pagination.ts";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  interface Props {
    options: PaginationOptions<string>;
    itemsCount: number;
  }

  const { options, itemsCount }: Props = $props();
</script>

<!-- Show pagination only if necessary. -->
{#if itemsCount > options.pageSize}
  <Pagination.Root
    count={itemsCount}
    page={options.page}
    perPage={options.pageSize}
    class="flex items-center gap-1 font-semibold text-slate-600"
    onPageChange={async (pageNumber) => {
      await goto(createPaginationUrl(page.url, { page: pageNumber }));
    }}
  >
    {#snippet children({ pages, currentPage })}
      <Pagination.PrevButton>
        {#snippet child({ props })}
          <button
            {...props}
            type="button"
            disabled={currentPage === 1}
            class="block rounded-md p-1 outline-yellow-300 transition-colors not-disabled:hover:bg-yellow-50 not-disabled:hover:text-yellow-600 focus:outline-2 disabled:text-slate-400"
          >
            <CaretLeftIcon weight="bold" />
          </button>
        {/snippet}
      </Pagination.PrevButton>

      {#each pages as p (p.key)}
        {#if p.type === "ellipsis"}
          <div class="px-2">...</div>
        {:else}
          <Pagination.Page page={p}>
            {#snippet child({ props })}
              <button
                {...props}
                disabled={p.value === currentPage}
                type="button"
                class="block rounded-md px-2 outline-yellow-300 transition-colors not-disabled:hover:bg-yellow-50 not-disabled:hover:text-yellow-600 focus:outline-2 disabled:bg-yellow-100 disabled:text-yellow-600"
              >
                {p.value}
              </button>
            {/snippet}
          </Pagination.Page>
        {/if}
      {/each}

      <Pagination.NextButton>
        {#snippet child({ props })}
          <button
            {...props}
            type="button"
            disabled={currentPage === pages.length}
            class="block rounded-md p-1 outline-yellow-300 transition-colors not-disabled:hover:bg-yellow-50 not-disabled:hover:text-yellow-600 focus:outline-2 disabled:text-slate-400"
          >
            <CaretRightIcon weight="bold" />
          </button>
        {/snippet}
      </Pagination.NextButton>
    {/snippet}
  </Pagination.Root>
{/if}
