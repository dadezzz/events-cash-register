import { createContext } from "svelte";
import DialogButton from "./DialogButton.svelte";
import DialogContent from "./DialogContent.svelte";
import DialogOverlay from "./DialogOverlay.svelte";
import DialogRoot from "./DialogRoot.svelte";

export interface DialogContext {
  id: string;
  open: boolean;
}

export function createDialogContext(id: string): DialogContext {
  return { id, open: false };
}

export const [getDialogContext, setDialogContext] = createContext<DialogContext>();

export { DialogButton, DialogContent, DialogOverlay, DialogRoot };
