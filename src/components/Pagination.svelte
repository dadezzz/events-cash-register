<script lang="ts">
  import { Pagination } from "bits-ui";
  import { CaretLeftIcon, CaretRightIcon } from "phosphor-svelte";
  import { getCurrentPage, goToPage } from "#lib/pagination.ts";
  import { page } from "$app/state";
  import { Button } from "./controls";

  interface Props {
    itemsCount: number;
    pageSize: number;
  }

  const { itemsCount, pageSize }: Props = $props();
</script>

<!-- Show pagination only if necessary. -->
{#if itemsCount > pageSize}
  <Pagination.Root
    count={itemsCount}
    page={getCurrentPage(page.url)}
    onPageChange={(newPage) => goToPage(newPage)}
    perPage={pageSize}
    class="flex items-center gap-1 font-semibold text-slate-600"
  >
    {#snippet children({ pages, currentPage })}
      <Pagination.PrevButton>
        {#snippet child({ props })}
          <Button
            {...props}
            type="button"
            disabled={currentPage === 1}
            class="block rounded-md p-1 outline-yellow-300 transition-colors not-disabled:hover:bg-yellow-50 not-disabled:hover:text-yellow-600 focus:outline-2 disabled:text-slate-400"
          >
            <CaretLeftIcon weight="bold" />
          </Button>
        {/snippet}
      </Pagination.PrevButton>

      {#each pages as p (p.key)}
        {#if p.type === "ellipsis"}
          <div class="px-2">...</div>
        {:else}
          <Pagination.Page page={p}>
            {#snippet child({ props })}
              <Button
                {...props}
                disabled={p.value === currentPage}
                type="button"
                class="block rounded-md px-2 outline-yellow-300 transition-colors not-disabled:hover:bg-yellow-50 not-disabled:hover:text-yellow-600 focus:outline-2 disabled:bg-yellow-100 disabled:text-yellow-600"
              >
                {p.value}
              </Button>
            {/snippet}
          </Pagination.Page>
        {/if}
      {/each}

      <Pagination.NextButton>
        {#snippet child({ props })}
          <Button
            {...props}
            type="button"
            disabled={currentPage === pages.length}
            class="block rounded-md p-1 outline-yellow-300 transition-colors not-disabled:hover:bg-yellow-50 not-disabled:hover:text-yellow-600 focus:outline-2 disabled:text-slate-400"
          >
            <CaretRightIcon weight="bold" />
          </Button>
        {/snippet}
      </Pagination.NextButton>
    {/snippet}
  </Pagination.Root>
{/if}
