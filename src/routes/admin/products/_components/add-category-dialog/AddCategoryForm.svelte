<script lang="ts">
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { TextInput } from "#components/form/input/index.ts";
  import { addProductCategoryForm } from "../../_forms.remote.ts";
  import { addProductCategoryFormSchema } from "../../_schemas.ts";

  interface Props {
    onresult: () => void;
  }

  const { onresult }: Props = $props();

  const form = addProductCategoryForm.preflight(addProductCategoryFormSchema);
</script>

<Form {form} {onresult}>
  <TextInput field={form.fields.name} label="Nome" />

  <Button type="submit">Crea</Button>
</Form>
