import { create } from "zustand";

type NotificationsState = {
  notificationsCount: number;
  setNotificationsCount: (updater: (prev: number) => number) => void;
  reset: () => void;
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notificationsCount: 0,
  setNotificationsCount: (updater) =>
    set((state) => ({ notificationsCount: updater(state.notificationsCount) })),
  reset: () => set({ notificationsCount: 0 }),
}));
