<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "#components/controls/index.ts";
  import { Form } from "#components/form/index.ts";
  import { signOutForm } from "./_form.remote.ts";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<Form form={signOutForm}>
  <Button type="submit" {children} />
</Form>
