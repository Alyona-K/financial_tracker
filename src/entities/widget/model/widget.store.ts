import { create } from "zustand";
import { WidgetCardData } from "./widget.types";
import { defaultWidgets } from "@/shared/hooks/useWidgetsData"; 

type WidgetsState = {
  widgets: WidgetCardData[]; 
  setWidgets: (widgets: WidgetCardData[]) => void; 
  clearWidgets: () => void; 
  openMenuId: string | null; 
  setOpenMenuId: (id: string | null) => void; 
};

export const useWidgetsStore = create<WidgetsState>((set) => ({
  widgets: defaultWidgets,
  setWidgets: (widgets) => set({ widgets }),
  clearWidgets: () => set({ widgets: defaultWidgets }),
  openMenuId: null,
  setOpenMenuId: (id) => set({ openMenuId: id }),
}));
