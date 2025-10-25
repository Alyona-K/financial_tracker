import { create } from "zustand";

type NotificationsState = {
  notificationsCount: number;
  setNotificationsCount: (updater: (prev: number) => number) => void;
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notificationsCount: 0,
  setNotificationsCount: (updater) =>
    set((state) => ({
      notificationsCount: updater(state.notificationsCount),
    })),
}));