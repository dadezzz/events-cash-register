<script lang="ts">
  import { PlusIcon } from "phosphor-svelte";
  import { Button } from "#components/controls/index.ts";
  import { Dialog } from "#components/dialog/index.ts";
  import { Form } from "#components/form/index.ts";
  import { CheckboxInput, NumericInput, TextInput } from "#components/form/input/index.ts";
  import { FormatDuration, FormatPrice } from "#components/format/index.ts";
  import Pagination from "#components/navigation/Pagination.svelte";
  import { Table, TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow } from "#components/table/index.ts";
  import { Duration } from "#lib/duration.ts";
  import { Product } from "#lib/entities/products/client/index.ts";
  import { paginationSchema } from "#lib/entities/products/pagination.ts";
  import { getCurrentPaginationOptions } from "#lib/pagination.ts";
  import { ADMIN_PRODUCTS_PAGE_SIZE } from "$app/env/public";
  import { page } from "$app/state";
  import DeleteProductButton from "./_components/DeleteProductButton.svelte";
  import UpdateProductButton from "./_components/UpdateProductButton.svelte";
  import { addProductForm } from "./_forms.remote.ts";
  import { addProductFormSchema } from "./_schemas.ts";

  const paginationOptions = $derived(getCurrentPaginationOptions(paginationSchema, page.url));
  const products = $derived(await Product.getAll(paginationOptions));
  const productsCount = $derived(await Product.countAll());

  let addProductDialogOpen = $state(false);
</script>

<Dialog bind:open={addProductDialogOpen}>
  {#snippet trigger({ props })}
    <Button type="button" {...props} class="font-bold bg-black text-white flex items-center gap-2 p-1 px-3 rounded-md">
      <PlusIcon class="size-5" />
      <span>Nuovo</span>
    </Button>
  {/snippet}
  {#snippet content({ props })}
    <div {...props} class="fixed top-1/2 left-1/2 -translate-1/2 bg-white z-50">
      <Form
        form={addProductForm.preflight(addProductFormSchema)}
        onresult={() => {
          addProductDialogOpen = false;
        }}
      >
        <TextInput field={addProductForm.fields.name} label="Nome" />
        <NumericInput field={addProductForm.fields.price} label="Prezzo" />
        <CheckboxInput field={addProductForm.fields.available} label="In vendita" />

        <Button type="submit">Crea</Button>
      </Form>
    </div>
  {/snippet}
</Dialog>

<Table>
  {#snippet head()}
    <TableHeadRow>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "name" }}>Nome</TableHeadCell>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "price" }}>Prezzo</TableHeadCell>
      <TableHeadCell>In vendita</TableHeadCell>
      <TableHeadCell pagination={{ options: paginationOptions, columnName: "createdAt" }}>Creato</TableHeadCell>
      <TableHeadCell>Azioni</TableHeadCell>
    </TableHeadRow>
  {/snippet}

  {#snippet body()}
    {#each products as product (product.data.id)}
      <TableBodyRow>
        <TableBodyCell>{product.data.name}</TableBodyCell>
        <TableBodyCell><FormatPrice price={product.data.price} /></TableBodyCell>
        <TableBodyCell>{product.data.available}</TableBodyCell>

        <TableBodyCell>
          <FormatDuration duration={Duration.fromMilliseconds(Date.now() - product.data.createdAt.getTime())} /> fa
        </TableBodyCell>

        <TableBodyCell>
          <UpdateProductButton {product} />
          <DeleteProductButton {product} />
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  {/snippet}
</Table>

<Pagination {paginationOptions} pageSize={ADMIN_PRODUCTS_PAGE_SIZE} itemsCount={productsCount} />
