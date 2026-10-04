<script lang="ts">
  import { ArrowLeftIcon } from "phosphor-svelte";
  import { FormatDuration } from "#components/format/index.ts";
  import Header from "#components/Header.svelte";
  import { Duration } from "#lib/duration.ts";
  import { UserClient } from "#lib/entities/user/client/index.ts";
  import type { UserId } from "#lib/entities/user/id.ts";
  import ColumnsLayout from "../_components/ColumnsLayout.svelte";
  import UsersColumn from "../_components/UsersColumn.svelte";
  import DeleteUserDialog from "./_components/DeleteUserDialog.svelte";
  import UpdatePrivilegesForm from "./_components/UpdatePrivilegesForm.svelte";
  import UpdateProfileForm from "./_components/UpdateProfileForm.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const user = $derived(await UserClient.fromIdAdmin(params.userId as UserId));
</script>

<svelte:head>
  <title>Configurazione utenti | Cassa</title>
</svelte:head>

<Header>
  <h1>Configurazione utenti</h1>
</Header>

<ColumnsLayout mainColumn="second">
  {#snippet firstColumn()}
    <UsersColumn />
  {/snippet}
  {#snippet secondColumn()}
    <div class="border-mist-default flex gap-2 border-b p-2 font-bold">
      <a href="/admin/users" class="button-ghost p-1 text-mist-700 md:hidden dark:text-mist-300">
        <ArrowLeftIcon class="size-4" />
      </a>

      <h2 class="flex w-full gap-1 text-nowrap">
        <span>Dettagli</span>
        <span class="md:hidden">per {user.data.name}</span>
      </h2>
    </div>

    <div class="flex flex-col gap-4 overflow-y-auto p-2">
      <h3 class="font-semibold">Profilo</h3>

      <UpdateProfileForm {user} />

      <p class="text-mist-600 dark:text-mist-400">
        Creato <FormatDuration duration={Duration.fromDate(user.data.createdAt)} precision={2} /> fa.
      </p>

      <h3 class="font-semibold">Privilegi</h3>

      <UpdatePrivilegesForm {user} />

      <h3 class="font-semibold">Elimina</h3>

      <p>L'utente verrà eliminato dal database. Non verranno persi gli ordini associati ad esso.</p>

      <DeleteUserDialog {user} />
    </div>
  {/snippet}
</ColumnsLayout>
