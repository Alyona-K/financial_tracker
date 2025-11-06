// --- IMPORTS & TYPES ---
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "./auth.api";
import type { LoginCredentials, RegisterCredentials } from "./auth.types";
import { useUserStore } from "@/entities/user/model/user.store";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  skipAutoLogin: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: (fullClear?: boolean) => void;
  initDemoUser: (skipIfAuthPage?: boolean) => Promise<void>;
  refreshToken: () => Promise<void>;
}

// --- CONSTANTS ---
const DEMO_CREDENTIALS: LoginCredentials = {
  email: "demo@fintrack.com",
  password: "demo123",
};

// --- AUTH STORE ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isLoading: false,
      error: null,
      skipAutoLogin: false,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authApi.login(credentials);

          set({ token: accessToken, isLoading: false });

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

          useUserStore.getState().setUser(user);
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Failed to register",
            isLoading: false,
          });
          throw err;
        }
      },

      logout: (fullClear = false) => {
        set({ token: null, skipAutoLogin: true });
        useUserStore.getState().setUser(null);
        if (fullClear) {
          localStorage.removeItem("auth-storage");
        }
      },

      initDemoUser: async (skipIfAuthPage = false) => {
        const currentUser = useUserStore.getState().user;
        if (skipIfAuthPage || currentUser) return;

        try {
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
