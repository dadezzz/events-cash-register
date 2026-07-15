<script lang="ts">
  import { Popover } from "bits-ui";
  import { SidebarIcon } from "phosphor-svelte";
  import type { Snippet } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import SignoutForm from "#components/actions/sign-out/SignoutForm.svelte";
  import { Button } from "#components/controls/index.ts";
  import Dialog from "#components/Dialog.svelte";
  import Navigation from "#components/navigation/Navigation.svelte";
  import Separator from "#components/Separator.svelte";
  import { getAdminUserId } from "#lib/auth/index.remote.ts";
  import { UserClient } from "#lib/entities/user/client/index.ts";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();

  const user = $derived(await UserClient.fromSelf());

  let sidebarOpen = $state(false);

  // SSR safe since sidebar should always be closed on initial rendering.
  // This matches tailwindcss's md breakpoint.
  const isMdWidth = new MediaQuery("(width >= 768px)", false);
</script>

{#snippet userPopover(user: UserClient)}
  <Popover.Root>
    <Popover.Trigger class="flex gap-1 items-center mt-auto">
      <div class="bg-black text-white rounded-full px-2">
        {user.data.name.charAt(0)}
      </div>
      <div>{user.data.name}</div>
    </Popover.Trigger>
    <Popover.Content class="bg-white shadow border border-slate-100 rounded-md p-1">
      <Popover.Arrow class="text-slate-100" />
      <div>
        <p>{user.data.name}</p>
        <p>@{user.data.username}</p>
      </div>
      <Separator aria-orientation="horizontal" />
      <!-- <div> -->
      <!-- Settings for theme mode and language? -->
      <!-- </div> -->
      <!-- <Separator aria-orientation='horizontal' /> -->
      <div>
        <SignoutForm>Sign out</SignoutForm>
      </div>
    </Popover.Content>
  </Popover.Root>
{/snippet}

{#snippet sidebarContent()}
  <div class="sticky flex flex-col h-full top-0 overflow-y-auto p-2">
    <div class="w-full items-end flex flex-col mb-2">
      <Button
        type="button"
        onclick={() => {
          sidebarOpen = false;
        }}
      >
        <SidebarIcon class="size-5" />
      </Button>
    </div>

    <Navigation
      entries={[
        { href: "/", label: "Cassa" },
        { href: "/orders", label: "Ordini" },
      ]}
    >
      {#snippet entryUI({ label })}
        <div class="text-nowrap">{label}</div>
      {/snippet}
    </Navigation>

    <Separator aria-orientation="horizontal" class="my-2 border-slate-200" />

    {#if await getAdminUserId()}
      <Navigation
        entries={[
          { href: "/admin", label: "Amministrazione" },
          { href: "/admin/users", label: "Utenti" },
          { href: "/admin/products", label: "Prodotti" },
          { href: "/admin/printers", label: "Stampanti" },
          { href: "/admin/receipts", label: "Comande e scontrini" },
        ]}
      >
        {#snippet entryUI({ href, label })}
          {#if href === "/admin"}
            <div class="text-nowrap">{label}</div>
          {:else}
            <div class="border-l border-slate-200 pl-2 ml-1 text-nowrap">
              {label}
            </div>
          {/if}
        {/snippet}
      </Navigation>

      {#if user}
        {@render userPopover(user)}
      {/if}
    {/if}
  </div>
{/snippet}

<div class="flex h-full">
  {#if sidebarOpen && isMdWidth.current}
    <div class="border-r border-slate-300">
      {@render sidebarContent()}
    </div>
  {/if}

  <div class="w-full flex flex-col">
    <header class="flex border-b border-slate-300 p-2 gap-4 items-center">
      <Dialog
        bind:open={() => {
            return sidebarOpen && !isMdWidth.current;
          }, (v) => {
            if (!isMdWidth.current) sidebarOpen = v;
          }}
      >
        {#snippet content({ props })}
          <div {...props} class="fixed inset-y-0 z-50 bg-default">
            {@render sidebarContent()}
          </div>
        {/snippet}
      </Dialog>

      <Button
        type="button"
        class={[sidebarOpen ? "hidden" : ""]}
        onclick={() => {
          sidebarOpen = true;
        }}
      >
        <SidebarIcon class="size-5" />
      </Button>

      <p>Other header stuff that occupies some space</p>
    </header>

    <main class="grow">
      {@render children()}
    </main>
  </div>
</div>
