<script lang="ts">
  import {
    ArrowCounterClockwiseIcon,
    CashRegisterIcon,
    GearIcon,
    PrinterIcon,
    ReceiptIcon,
    ShoppingCartIcon,
    SidebarIcon,
    UserGearIcon,
  } from "phosphor-svelte";
  import Navigation from "#components/navigation/Navigation.svelte";
  import { getAdminUserId } from "#lib/auth/index.remote.ts";
  import { page } from "$app/state";
  import { SidebarButton } from "./index.ts";
</script>

{#snippet navHomeLabel()}
  <div class="flex gap-2 items-center">
    <CashRegisterIcon class="size-5 shrink-0" />
    <span>Cassa</span>
  </div>
{/snippet}

{#snippet navOrdersLabel()}
  <div class="flex gap-2 items-center">
    <ArrowCounterClockwiseIcon class="size-5 shrink-0" />
    <span>Ordini</span>
  </div>
{/snippet}

{#snippet navAdminLabel()}
  <div class="flex gap-2 items-center">
    <GearIcon class="size-5 shrink-0" />
    <span>Amministrazione</span>
  </div>
{/snippet}

{#snippet navAdminUsersLabel()}
  <div class="flex gap-2 items-center">
    <UserGearIcon class="size-5 shrink-0" />
    <span>Utenti</span>
  </div>
{/snippet}

{#snippet navAdminProductsLabel()}
  <div class="flex gap-2 items-center">
    <ShoppingCartIcon class="size-5 shrink-0" />
    <span>Prodotti</span>
  </div>
{/snippet}

{#snippet navAdminPrintersLabel()}
  <div class="flex gap-2 items-center">
    <PrinterIcon class="size-5 shrink-0" />
    <span>Stampanti</span>
  </div>
{/snippet}

{#snippet navAdminReceiptsLabel()}
  <div class="flex gap-2 items-center">
    <ReceiptIcon class="size-5 shrink-0" />
    <span>Ricevute e comande</span>
  </div>
{/snippet}

<!-- overflow-x-hidden prevents scrollbar from appearing when tranitioning. -->
<div
  class="sticky gap-2 flex flex-col h-full top-0 overflow-y-auto p-2 shadow border-r border-mist-300 dark:border-mist-700 overflow-x-hidden"
>
  <div class="w-full flex">
    <SidebarButton
      class="ml-auto text-mist-600 dark:text-mist-400 rounded-md focus:outline-2 outline-emerald-default p-1 hover:bg-slate-200 dark:hover:bg-slate-800"
    >
      <SidebarIcon class="size-5" />
    </SidebarButton>
  </div>

  <Navigation
    entries={[
      { href: "/products", label: navHomeLabel },
      { href: "/orders", label: navOrdersLabel },

      ...((await getAdminUserId())
        ? [
            { href: "/admin", label: navAdminLabel },
            { href: "/admin/users", label: navAdminUsersLabel },
            { href: "/admin/products", label: navAdminProductsLabel },
            { href: "/admin/printers", label: navAdminPrintersLabel },
            { href: "/admin/receipts", label: navAdminReceiptsLabel },
          ]
        : []),
    ]}
  >
    {#snippet entriesUI({ entries, wrappedEntryUI })}
      <div class="flex flex-col gap-1 mb-1">
        {#each entries.slice(0, 3) as entry (entry.href)}
          {@render wrappedEntryUI(entry)}
        {/each}
      </div>

      <div class="border-mist-200 flex flex-col gap-1 border-l dark:border-mist-800 ml-5">
        {#each entries.slice(3) as entry (entry.href)}
          {@render wrappedEntryUI(entry)}
        {/each}
      </div>
    {/snippet}
    {#snippet entryUI({ href, label })}
      <div
        class={[
          "ml-1 text-nowrap rounded-md hover:bg-mist-200 dark:hover:bg-mist-800 py-1 px-2 group-focus:outline-2 outline-emerald-default",
          page.url.pathname === href ? "bg-mist-100 dark:bg-mist-900" : "",
        ]}
      >
        {@render label()}
      </div>
    {/snippet}
  </Navigation>
</div>
