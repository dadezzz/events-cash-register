import { createContext } from "svelte";
import PopoverAnchor from "./PopoverAnchor.svelte";
import PopoverButton from "./PopoverButton.svelte";
import PopoverContent from "./PopoverContent.svelte";
import PopoverRoot from "./PopoverRoot.svelte";

export interface PopoverContext {
  id: string;
  open: boolean;
}

export function createPopoverContext(id: string): PopoverContext {
  return { id, open: false };
}

export const [getPopoverContext, setPopoverContext] = createContext<PopoverContext>();

export function popoverAnchorName(id: string) {
  return `--${id}-anchor`;
}

export { PopoverAnchor, PopoverButton, PopoverContent, PopoverRoot };
