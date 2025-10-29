import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "./auth.api";
import type { LoginCredentials, RegisterCredentials } from "./auth.types";
import { useUserStore } from "@/entities/user/model/user.store";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  initDemoUser: (skipIfAuthPage?: boolean) => Promise<void>;
  refreshToken: () => Promise<void>; // новый метод для автологина
}

const DEMO_CREDENTIALS: LoginCredentials = {
  email: "demo@fintrack.com",
  password: "demo123",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authApi.login(credentials);

          // Сохраняем токен
          set({ token: accessToken, isLoading: false });

          // Передаём пользователя в userStore напрямую
          useUserStore.getState().setUser(user);
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Failed to log in",
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authApi.register(credentials);
          set({ token: accessToken, isLoading: false });

          // У регистраций уже есть firstName/lastName из формы
          useUserStore.getState().setUser(user);
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Failed to register",
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => {
        set({ token: null });
        useUserStore.getState().setUser(null);
      },

      initDemoUser: async (skipIfAuthPage = false) => {
        if (skipIfAuthPage) return;
        try {
          set({ token: null });
          useUserStore.getState().setUser(null);

          const { accessToken, user } = await authApi.login(DEMO_CREDENTIALS);
          set({ token: accessToken });
          useUserStore.getState().setUser(user);
        } catch (err) {
          console.warn("[Auth] Failed to auto-login demo user", err);
        }
      },

      refreshToken: async () => {
        await get().login(DEMO_CREDENTIALS);
      },
    }),
    { name: "auth-storage" }
  )
);



