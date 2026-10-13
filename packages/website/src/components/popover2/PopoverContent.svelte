<script lang="ts">
  import { onMount, untrack } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { beforeNavigate } from "$app/navigation";
  import { getPopoverContext, getPopoverPortalContext } from "./index.ts";

  interface Props extends HTMLAttributes<HTMLElement> {
    usePortal?: boolean;
    closeOnNav?: boolean;
  }

  let { usePortal = false, closeOnNav = true, class: className, children, ...rest }: Props = $props();

  const popoverCtx = getPopoverContext();
  const portalCtx = getPopoverPortalContext();

  let element: HTMLElement | undefined = $state();

  // Placeholder for when the popover element is sent to the portal.
  let placeHolder: Comment | undefined;
  onMount(() => {
    placeHolder = document.createComment("to PopoverPortal");

    return () => {
      placeHolder?.remove();
    };
  });

  // Send the popover to the portal element to make all the rest of the HTML
  // inert when open.
  // Also handle when switching usePortal to false, by returning the element to
  // its original position.
  $effect(() => {
    if (!element || !placeHolder) {
      return;
    }

    if (usePortal) {
      element.replaceWith(placeHolder);
      portalCtx.portalDiv?.appendChild(element);

      return () => {
        if (element && element.parentElement === portalCtx.portalDiv) {
          portalCtx.portalDiv?.removeChild(element);
        }
      };
    } else {
      if (placeHolder.parentElement) {
        placeHolder.replaceWith(element);
      } else if (element.parentElement === portalCtx.portalDiv) {
        // Placeholder is lost, we don't know where e came from, so we just
        // delete it.
        element.remove();
      }
    }
  });

  // If using the portal, make the main element inert when the popover is open.
  $effect(() => {
    if (portalCtx.mainDiv) {
      portalCtx.mainDiv.inert = usePortal && popoverCtx.open;
    }

    return () => {
      if (portalCtx.mainDiv) {
        portalCtx.mainDiv.inert = false;
      }
    };
  });

  // React to changes in the context.open variable.
  $effect(() => {
    if (untrack(() => !element?.popover)) {
      return;
    }

    if (popoverCtx.open) {
      element?.showPopover();
    } else {
      element?.hidePopover();
    }
  });

  // React when popoverCtx.type changes. Going from js to popover could leave a
  // not correct open value in the context.
  $effect(() => {
    if (popoverCtx.type !== "js") {
      popoverCtx.open = !!element?.matches(":popover-open");
    }
  });

  // Close popover before navigation (by default, since it's expected behavior).
  beforeNavigate(() => {
    if (closeOnNav) {
      popoverCtx.open = false;
    }
  });
</script>

<div
  {...rest}
  bind:this={element}
  // If the popover is set to js, it's the user responsibility to handle
  // positioning (not anchoring) and to create a proper backdrop.
  popover={popoverCtx.type !== "js" ? popoverCtx.type : undefined}
  data-open={popoverCtx.open}
  id={popoverCtx.popoverId}
  // Attach to the anchor element if needed.
  data-anchored={!!popoverCtx.anchorId}
  style="--anchor-name: {popoverCtx.anchorId}"
  class={["data-[anchored=true]:anchored/(--anchor-name)", className]}
  // Keep the context.open variable synchronized with the state of the popover.
  ontoggle={(e) => {
    popoverCtx.open = e.newState === "open";
  }}
>
  {@render children?.()}
</div>
