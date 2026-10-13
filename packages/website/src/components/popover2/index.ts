import { createContext } from "svelte";
import PopoverAnchor from "./PopoverAnchor.svelte";
import PopoverButton from "./PopoverButton.svelte";
import PopoverContent from "./PopoverContent.svelte";
import PopoverPortal from "./PopoverPortal.svelte";
import PopoverRoot from "./PopoverRoot.svelte";

export interface PopoverPortalContext {
  mainDiv?: HTMLElement;
  portalDiv?: HTMLElement;
}

export const [getPopoverPortalContext, setPopoverPortalContext] = createContext<PopoverPortalContext>();

export type PopoverType = "js" | "auto" | "manual";

export interface PopoverContext {
  anchorId?: string;
  popoverId: string;
  open: boolean;
  type: PopoverType;
}

export const [getPopoverContext, setPopoverContext] = createContext<PopoverContext>();

export { PopoverAnchor, PopoverButton, PopoverContent, PopoverPortal, PopoverRoot };
