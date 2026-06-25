<script lang="ts">
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { PasswordInput, TextInput } from "#components/form/input/index.ts";
  import { signInForm } from "./_forms/sign-in.remote.ts";
</script>

<Form form={signInForm}>
  <TextInput field={signInForm.fields.username} label="Nome utente" />
  <PasswordInput field={signInForm.fields.password} label="Password" />

  <Button type="submit">Invia</Button>
</Form>
