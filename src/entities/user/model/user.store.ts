import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userApi } from "./user.api";
import type { User, UpdateUserPayload } from "./user.types";

interface UserState {
  user: User | null;
  fetchUser: (id: number) => Promise<void>;
  updateUser: (data: UpdateUserPayload) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      fetchUser: async (id) => {
        const data = await userApi.getById(id);
        set({ user: data });
      },

      updateUser: async (data) => {
        const current = get().user;
        if (!current) return;
        const updated = await userApi.update(current.id, data);
        set({ user: updated });
      },
    }),
    {
      name: "user-storage",
    }
  )
);
