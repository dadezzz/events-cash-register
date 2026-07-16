<script lang="ts">
  import { Popover } from "bits-ui";
  import { SidebarIcon, SignOutIcon } from "phosphor-svelte";
  import type { Snippet } from "svelte";
  import SignoutForm from "#components/actions/sign-out/SignoutForm.svelte";
  import Separator from "#components/Separator.svelte";
  import { SidebarButton } from "#components/sidebar/index.ts";
  import { UserClient } from "#lib/entities/user/client/index.ts";

  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();

  const user = $derived(await UserClient.fromSelf());
</script>

<header class="flex border-b border-mist-strong p-2 gap-4 items-center">
  <SidebarButton
    class="text-mist-600 dark:text-mist-400 rounded-md focus:outline-2 outline-emerald-default p-1 hover:bg-slate-200 dark:hover:bg-slate-800 data-[sidebar-open=true]:hidden"
  >
    <SidebarIcon class="size-5" />
  </SidebarButton>

  {@render children?.()}

  {#if user}
    <Popover.Root>
      <Popover.Trigger
        class="flex gap-1 items-center ml-auto bg-mist-200 dark:bg-mist-800 rounded-full px-2 focus:outline-2 outline-emerald-default"
      >
        {user.data.name.charAt(0)}
      </Popover.Trigger>
      <Popover.Content class="popover-default">
        <Popover.Arrow class="text-mist-200 dark:text-mist-800" />

        <div class="rounded-md py-1 px-2 bg-mist-100 dark:bg-mist-900">
          <p>{user.data.name}</p>
          <p class="text-xs text-mist-500 dark:text-mist-500">@{user.data.username}</p>
        </div>

        <Separator orientation="horizontal" class="border-mist-default my-1" />

        <!-- <div> -->
        <!-- Settings for theme mode and language? -->
        <!-- </div> -->
        <!-- <Separator aria-orientation='horizontal' /> -->

        <SignoutForm
          class="flex gap-2 items-center w-full rounded-md py-1 px-2 hover:bg-mist-200 dark:hover:bg-mist-800 focus:outline-2 outline-emerald-default"
        >
          <SignOutIcon class="size-5" />
          <span>Logout</span>
        </SignoutForm>
      </Popover.Content>
    </Popover.Root>
  {:else}
    <div class="size-5"></div>
  {/if}
</header>
