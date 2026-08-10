<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { PasswordInput, TextInput } from "#components/form/input/index.ts";
  import Header from "#components/Header.svelte";
  import { signInForm } from "./_forms.remote.ts";
  import { signInFormSchema } from "./_schemas.ts";
</script>

<svelte:head>
  <title>Accedi | Cassa</title>
</svelte:head>

<Header />

<div class="mx-2 my-8 flex h-full flex-col items-center justify-center">
  <div>
    <h2 class="text-2xl font-bold">Accedi per continuare</h2>
    <p class="mb-8">Usa le credenziali fornite dall'amministratore.</p>

    <Form form={signInForm.preflight(signInFormSchema)} class="flex flex-col gap-2">
      <TextInput field={signInForm.fields.username} label="Nome utente" autocomplete="username" />
      <PasswordInput field={signInForm.fields._password} label="Password" autocomplete="current-password" />

      <button type="submit" class="button-primary mt-2 w-full px-2 py-1">Accedi</button>
    </Form>
  </div>
</div>
