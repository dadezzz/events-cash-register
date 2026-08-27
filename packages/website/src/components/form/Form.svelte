<script lang="ts" generics="I extends RemoteFormInput | void, R">
  import type { RemoteForm, RemoteFormInput } from "@sveltejs/kit";
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";

  // Can be used to show spinners and feedback that something is going on.
  const WAITING_DELAY = 500;
  // Can be used to tell the user to check their connection or retry.
  const TIMEOUT_DELAY = 7000;

  // biome-ignore lint/suspicious/noConfusingVoidType: Svelte types :|
  interface FormProps<I extends RemoteFormInput | void, R = void> extends HTMLFormAttributes {
    children: Snippet;
    form: Omit<RemoteForm<I, R>, "for"> | RemoteForm<I, R>;
    onresult?: (result: R | null) => void;
    onsubmit?: () => void;
    ontimeout?: () => void;
    onwaiting?: () => void;
  }

  const { children, form, onresult, onsubmit, ontimeout, onwaiting, ...rest }: FormProps<I, R> = $props();
</script>

<form
  {...rest}
  {...form.enhance(async ({ submit }) => {
    const waitingTimeout = setTimeout(() => {
      onwaiting?.();
    }, WAITING_DELAY);

    const timeoutTimeout = setTimeout(() => {
      ontimeout?.();
    }, TIMEOUT_DELAY);

    onsubmit?.();
    if (await submit()) {
      onresult?.(form.result ?? null);
    }

    clearTimeout(waitingTimeout);
    clearTimeout(timeoutTimeout);
  })}
  oninput={async () => {
    await form.validate({ preflightOnly: true });
  }}
>
  {@render children()}
</form>
