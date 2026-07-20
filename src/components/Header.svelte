<script lang="ts">
  import { SidebarIcon, SignOutIcon } from "phosphor-svelte";
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";
  import SignoutForm from "#components/actions/sign-out/SignoutForm.svelte";
  import Popover from "#components/Popover.svelte";
  import Separator from "#components/Separator.svelte";
  import { SidebarButton } from "#components/sidebar/index.ts";
  import { UserClient } from "#lib/entities/user/client/index.ts";

  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();

  const user = $derived(await UserClient.fromSelf());
</script>

<header class="border-mist-strong flex items-center gap-4 border-b p-2">
  <SidebarButton class="button-ghost p-1 text-mist-700 data-[sidebar-open=true]:hidden dark:text-mist-300">
    <SidebarIcon class="size-5" />
  </SidebarButton>

  {@render children?.()}

  {#if user}
    <Popover>
      {#snippet trigger({ props })}
        <button
          type="button"
          {...props}
          class="outline-emerald-default ml-auto flex size-7 items-center justify-center rounded-full bg-mist-200 p-1 focus:outline-2 dark:bg-mist-800"
        >
          {user.data.name.charAt(0)}
        </button>
      {/snippet}
      {#snippet content({ props })}
        <div {...props} class="popover-default p-2" transition:fly>
          <div class="rounded-md bg-mist-100 px-2 py-1 dark:bg-mist-900">
            <p>{user.data.name}</p>
            <p class="text-xs text-mist-500 dark:text-mist-500">@{user.data.username}</p>
          </div>

          <Separator orientation="horizontal" class="border-mist-default my-2" />

          <!-- <div> -->
          <!-- Settings for theme mode and language? -->
          <!-- </div> -->
          <!-- <Separator aria-orientation='horizontal' /> -->

          <SignoutForm
            class="outline-emerald-default flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-mist-200 focus:outline-2 dark:hover:bg-mist-800"
          >
            <SignOutIcon class="size-5" />
            <span>Logout</span>
          </SignoutForm>
        </div>
      {/snippet}
    </Popover>
  {:else}
    <!-- Keeps head height consistent when sidebar is open. -->
    <div class="size-7"></div>
  {/if}
</header>
