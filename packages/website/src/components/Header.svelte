<script lang="ts">
  import { SidebarIcon, SignOutIcon } from "phosphor-svelte";
  import type { Snippet } from "svelte";
  import SignoutForm from "#components/actions/sign-out/SignoutForm.svelte";
  import { PopoverAnchor, PopoverButton, PopoverContent, PopoverRoot } from "#components/popover2/index.ts";
  import Separator from "#components/Separator.svelte";
  import { UserClient } from "#lib/entities/user/client/index.ts";

  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();

  const user = $derived(await UserClient.fromSelf());
</script>

<header class="border-mist-strong flex items-center border-b p-2">
  <PopoverButton
    class="button-ghost p-1 text-mist-700 data-[open=false]:mr-4 data-[open=true]:hidden dark:text-mist-300"
  >
    <SidebarIcon class="size-5" />
  </PopoverButton>

  {@render children?.()}

  {#if user}
    <PopoverRoot type="auto">
      <PopoverAnchor class="ml-auto">
        <PopoverButton
          class="outline-emerald-default flex size-7 items-center justify-center rounded-full bg-mist-200 p-1 focus:outline-2 dark:bg-mist-800"
        >
          {user.data.name.charAt(0)}
        </PopoverButton>
      </PopoverAnchor>

      <PopoverContent class="anchored-bottom-span-left popover-content popover-floating-border p-2">
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
      </PopoverContent>
    </PopoverRoot>
  {/if}
</header>
