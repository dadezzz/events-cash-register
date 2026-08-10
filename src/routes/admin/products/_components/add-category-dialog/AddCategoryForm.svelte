<script lang="ts">
  import { Form } from "#components/form/index.ts";
  import { TextInput } from "#components/form/input/index.ts";
  import { addProductCategoryForm } from "../../_forms.remote.ts";
  import { addProductCategoryFormSchema } from "../../_schemas.ts";

  interface Props {
    onresult: () => void;
    oncancel: () => void;
  }

  const { onresult, oncancel }: Props = $props();

  const form = addProductCategoryForm.preflight(addProductCategoryFormSchema);
</script>

<Form {form} {onresult} class="flex flex-col gap-2">
  <TextInput field={form.fields.name} label="Nome" />

  <div class="mt-2 flex justify-end gap-2">
    <button type="button" class="button-secondary px-2 py-1" onclick={oncancel}>Annulla</button>
    <button type="submit" class="button-primary px-2 py-1">Crea</button>
  </div>
</Form>
