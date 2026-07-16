<script lang="ts">
  import { CopyrightIcon } from "phosphor-svelte";
  import { Form } from "#components/form/index.ts";
  import { PasswordInput, TextInput } from "#components/form/input/index.ts";
  import Header from "#components/Header.svelte";
  import { signInForm } from "./_forms.remote.ts";
  import { signInFormSchema } from "./_schemas.ts";
</script>

<Header />

<div class="flex flex-col h-full my-12 items-center justify-center">
  <div class="md:mt-auto">
    <h2 class="text-2xl font-bold">Accedi per continuare</h2>
    <p class="mb-8">Usa le credenziali fornite dall'amministratore.</p>

    <Form form={signInForm.preflight(signInFormSchema)} class="flex flex-col gap-2">
      <TextInput field={signInForm.fields.username} label="Nome utente" />
      <PasswordInput field={signInForm.fields._password} label="Password" />

      <button
        type="submit"
        class="w-full dark:bg-emerald-700 hover:bg-emerald-300 dark:hover:bg-emerald-600 bg-emerald-200 font-semibold rounded-md py-1 mt-2 outline-emerald-default focus:outline-2"
      >
        Invia
      </button>
    </Form>
  </div>

  <p class="flex gap-1 items-center text-xs mt-auto text-mist-400 dark:text-mist-500">
    <CopyrightIcon />
    Davide Zarantonello
  </p>
</div>
