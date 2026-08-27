import { createContext } from "svelte";
import SidebarButton from "./SidebarButton.svelte";
import SidebarContent from "./SidebarContent.svelte";
import SidebarRoot from "./SidebarRoot.svelte";

export interface SidebarContext {
  open: boolean;
}

export const [getSidebarContext, setSidebarContext] = createContext<SidebarContext>();

export { SidebarButton, SidebarContent, SidebarRoot };
