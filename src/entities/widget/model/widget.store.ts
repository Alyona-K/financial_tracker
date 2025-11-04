import { create } from "zustand";
import { WidgetCardData } from "./widget.types";
import { defaultWidgets } from "@/shared/hooks/useWidgetsData"; // дефолтные виджеты

type WidgetsState = {
  widgets: WidgetCardData[]; // здесь мы будем хранить только UI-стейт
  setWidgets: (widgets: WidgetCardData[]) => void; // для ручной подстановки от хука
  clearWidgets: () => void; // сброс к дефолту
  openMenuId: string | null; // для управления открытым меню карточки
  setOpenMenuId: (id: string | null) => void; // управление меню
};

export const useWidgetsStore = create<WidgetsState>((set) => ({
  widgets: defaultWidgets,
  setWidgets: (widgets) => set({ widgets }),
  clearWidgets: () => set({ widgets: defaultWidgets }),
  openMenuId: null,
  setOpenMenuId: (id) => set({ openMenuId: id }),
}));
