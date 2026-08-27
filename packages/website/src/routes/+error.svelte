<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>Errore {page.status}</title>
</svelte:head>

<!--
  Add vertical margin. If the screen is still high enough then show the error on
  the center of the page.
-->
<div class="flex h-full flex-col items-center justify-center gap-2">
  <h1 class="text-9xl">{page.status}</h1>

  {page.error?.message ?? "Errore interno al server"}

  <a class="text-red-600 hover:underline focus:underline" href="/">Ritorna alla pagina home</a>
</div>
