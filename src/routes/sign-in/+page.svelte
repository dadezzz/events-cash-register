<script lang="ts">
  import { CopyrightIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { PasswordInput, TextInput } from "#components/form/input/index.ts";
  import Header from "#components/Header.svelte";
  import { signInForm } from "./_forms.remote.ts";
  import { signInFormSchema } from "./_schemas.ts";
</script>

<Header />

<div class="my-12 flex h-full flex-col items-center justify-center">
  <div class="md:mt-auto">
    <h2 class="text-2xl font-bold">Accedi per continuare</h2>
    <p class="mb-8">Usa le credenziali fornite dall'amministratore.</p>

    <Form form={signInForm.preflight(signInFormSchema)} class="flex flex-col gap-2">
      <TextInput field={signInForm.fields.username} label="Nome utente" autocomplete="username" />
      <PasswordInput field={signInForm.fields._password} label="Password" autocomplete="current-password" />

      <button type="submit" class="button-primary mt-2 w-full px-2 py-1">Accedi</button>
    </Form>
  </div>

  <p class="mt-auto flex items-center gap-1 text-xs text-mist-400 dark:text-mist-500">
    <CopyrightIcon />
    Davide Zarantonello
  </p>
</div>
