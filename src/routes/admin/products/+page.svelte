<script lang="ts">
  import { FormatDuration, FormatPrice } from "#components/format/index.ts";
  import Pagination from "#components/navigation/Pagination.svelte";
  import { Table, TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow } from "#components/table/index.ts";
  import { requireAdmin } from "#lib/auth/index.remote.ts";
  import { Duration } from "#lib/duration.ts";
  import { Product } from "#lib/entities/products/client/index.ts";
  import { paginationSchema } from "#lib/entities/products/pagination.ts";
  import { getCurrentPaginationOptions } from "#lib/pagination.ts";
  import { ADMIN_PRODUCTS_PAGE_SIZE } from "$app/env/public";
  import { page } from "$app/state";
  import AddProductDialog from "./_components/add-product-dialog/AddProductDialog.svelte";
  import DeleteProductDialog from "./_components/DeleteProductDialog.svelte";
  import UpdateProductDialog from "./_components/update-product-dialog/UpdateProductDialog.svelte";

  await requireAdmin();

  const paginationOptions = $derived(getCurrentPaginationOptions(paginationSchema, page.url));
  const products = $derived(await Product.getAll(paginationOptions));
  const productsCount = $derived(await Product.countAll());
</script>

<AddProductDialog />

<Table>
  {#snippet head()}
    <TableHeadRow>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "name" }}>Nome</TableHeadCell>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "price" }}>Prezzo</TableHeadCell>
      <TableHeadCell>In vendita</TableHeadCell>
      <TableHeadCell>Opzioni</TableHeadCell>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "createdAt" }}>Creato</TableHeadCell>
      <TableHeadCell>Azioni</TableHeadCell>
    </TableHeadRow>
  {/snippet}

  {#snippet body()}
    {#each products as product (product.data.id)}
      {@const options = await product.getOptions()}

      <TableBodyRow>
        <TableBodyCell>{product.data.name}</TableBodyCell>
        <TableBodyCell><FormatPrice price={product.data.price} /></TableBodyCell>
        <TableBodyCell>{product.data.available}</TableBodyCell>

        <TableBodyCell>{options.length}</TableBodyCell>

        <TableBodyCell>
          <FormatDuration duration={Duration.fromDate(product.data.createdAt)} />
          fa
        </TableBodyCell>

        <TableBodyCell>
          <UpdateProductDialog {product} />
          <DeleteProductDialog {product} />
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  {/snippet}
</Table>

<Pagination {paginationOptions} pageSize={ADMIN_PRODUCTS_PAGE_SIZE} itemsCount={productsCount} />
