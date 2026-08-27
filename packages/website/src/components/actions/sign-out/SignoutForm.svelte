<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import { Form } from "#components/form/index.ts";
  import { signOutForm } from "./_form.remote.ts";

  interface Props {
    class: ClassValue;
    children: Snippet;
  }

  const { class: classProp, children }: Props = $props();
</script>

<Form form={signOutForm}>
  <button type="submit" class={classProp}>{@render children()}</button>
</Form>
