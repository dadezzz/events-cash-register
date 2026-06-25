<script lang="ts">
  import { A } from "#components/controls/index.ts";
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>Error {page.status}</title>
</svelte:head>

<!--
  Add vertical margin. If the screen is still high enough then show the error on
  the center of the page.
-->
<div class="my-24 flex grow items-center">
  <main class="mx-4 flex w-full flex-col items-center gap-4">
    <h1 class="text-9xl">{page.status}</h1>

    {page.error?.message ?? "Errore interno al server"}

    <A class="text-red-600 hover:underline focus:underline" href="/">Ritorna alla pagina home</A>
  </main>
</div>
