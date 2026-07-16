<script lang="ts" generics="C extends string">
  import type { Snippet } from "svelte";
  import { createPaginationUrl, invertSortDirection, type PaginationOptions } from "#lib/pagination.ts";
  import { page } from "$app/state";

  type Props = {
    pagination?: {
      options: PaginationOptions<C>;
      columnName: C;
    };
    children: Snippet;
  };

  const { pagination, children }: Props = $props();
</script>

<th>
  {#if pagination}
    <a
      href={pagination.options.sortColumn === pagination.columnName
        ? createPaginationUrl(page.url, { sortDirection: invertSortDirection(pagination.options.sortDirection) }).href
        : createPaginationUrl<C>(page.url, { sortColumn: pagination.columnName, sortDirection: "desc" }).href}
    >
      {@render children()}
    </a>
  {:else}
    {@render children()}
  {/if}
</th>
