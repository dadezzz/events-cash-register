<script lang="ts" generics="T extends RemoteFormFieldValue">
  import type { RemoteFormField, RemoteFormFieldValue } from "@sveltejs/kit";
  import type { Snippet } from "svelte";

  interface Props {
    field: RemoteFormField<T>;
    children: Snippet<
      [{ inputProps: typeof inputProps; labelProps: typeof labelProps; errorProps: typeof errorProps }]
    >;
  }

  const { field, children }: Props = $props();

  const id = $props.id();

  const inputProps = $derived({
    "aria-describedby": field.issues()?.length ? `${id}-errors` : undefined,
    id,
    // Disable this event handler so that the browser doesn't show those ugly
    // tooltips that tell the user what is wrong with the input, we already have
    // the FieldErrors that.
    oninvalid: (e: Event) => {
      e.preventDefault();
    },
  });

  const errorProps = $derived({
    id: `${id}-errors`,
    errors: field.issues(),
  });

  const labelProps = $derived({
    for: id,
    "data-invalid": !!field.issues()?.length,
  });
</script>

{@render children({ errorProps, inputProps, labelProps })}
