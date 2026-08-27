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
  <div class="flex items-center gap-2">
    <CashRegisterIcon class="size-5 shrink-0" />
    <span>Cassa</span>
  </div>
{/snippet}

{#snippet navOrdersLabel()}
  <div class="flex items-center gap-2">
    <ArrowCounterClockwiseIcon class="size-5 shrink-0" />
    <span>Ordini</span>
  </div>
{/snippet}

{#snippet navAdminLabel()}
  <div class="flex items-center gap-2">
    <GearIcon class="size-5 shrink-0" />
    <span>Amministrazione</span>
  </div>
{/snippet}

{#snippet navAdminUsersLabel()}
  <div class="flex items-center gap-2">
    <UserGearIcon class="size-5 shrink-0" />
    <span>Utenti</span>
  </div>
{/snippet}

{#snippet navAdminProductsLabel()}
  <div class="flex items-center gap-2">
    <ShoppingCartIcon class="size-5 shrink-0" />
    <span>Prodotti</span>
  </div>
{/snippet}

{#snippet navAdminPrintersLabel()}
  <div class="flex items-center gap-2">
    <PrinterIcon class="size-5 shrink-0" />
    <span>Stampanti</span>
  </div>
{/snippet}

{#snippet navAdminReceiptsLabel()}
  <div class="flex items-center gap-2">
    <ReceiptIcon class="size-5 shrink-0" />
    <span>Ricevute e comande</span>
  </div>
{/snippet}

<!-- overflow-x-hidden prevents scrollbar from appearing when tranitioning. -->
<div
  class="border-mist-strong sticky top-0 flex h-full flex-col gap-2 overflow-x-hidden overflow-y-auto border-r p-2 shadow"
>
  <div class="flex">
    <SidebarButton class="button-ghost ml-auto p-1 text-mist-700 dark:text-mist-300">
      <SidebarIcon class="size-5" />
    </SidebarButton>
  </div>

  <Navigation
    class="flex flex-col gap-1"
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
      {#each entries.slice(0, 3) as entry (entry.href)}
        {@render wrappedEntryUI(entry)}
      {/each}

      <div class="border-mist-default ml-5 flex flex-col gap-1 border-l">
        {#each entries.slice(3) as entry (entry.href)}
          {@render wrappedEntryUI(entry)}
        {/each}
      </div>
    {/snippet}
    {#snippet entryUI({ href, label })}
      <!--
        We check with startsWith since pages typically have a /href/[uuid]
        subpage that would remove the highlight.
      -->
      <div
        aria-current={page.url.pathname.startsWith(href) ? "page" : false}
        class="outline-emerald-default ml-1 rounded-md px-2 py-1 text-nowrap group-focus:outline-2 hover:bg-mist-200 aria-[current=page]:bg-mist-100 dark:hover:bg-mist-800 dark:aria-[current=page]:bg-mist-900"
      >
        {@render label()}
      </div>
    {/snippet}
  </Navigation>
</div>
