// --- IMPORTS & TYPES ---
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "./auth.api";
import type { LoginCredentials, RegisterCredentials } from "./auth.types";
import { useUserStore } from "@/entities/user/model/user.store";
import { User } from "@/entities/user/model/user.types";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  skipAutoLogin: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: (fullClear?: boolean) => void;
  initDemoUser: (skipIfAuthPage?: boolean) => Promise<User | null>;
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
          let errorMessage = "Failed to log in";

          if (err.response?.status === 404) {
            errorMessage = "Cannot find user";
          } else if (err.response?.status === 401) {
            errorMessage = "Invalid password";
          } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          }

          set({ error: errorMessage });
          throw err;
        } finally {
          set({ isLoading: false }); 
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authApi.register(credentials);
          set({ token: accessToken, isLoading: false });
          useUserStore.getState().setUser(user);
        } catch (err: any) {
          let errorMessage = "Failed to register";

          if (err.response?.status === 409) {
            errorMessage = "User with this email already exists";
          } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          }

          set({ error: errorMessage, isLoading: false });
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

      initDemoUser: async (skipIfAuthPage = false): Promise<User | null> => {
        const currentUser = useUserStore.getState().user;
        if (skipIfAuthPage || currentUser) return currentUser || null;

        try {
          const { accessToken, user } = await authApi.login(DEMO_CREDENTIALS);
          set({ token: accessToken });
          useUserStore.getState().setUser(user);
          return user;
        } catch (err) {
          console.warn("[Auth] Failed to auto-login demo user", err);
          return null;
        }
      },

      refreshToken: async () => {
        const currentRefreshToken = localStorage.getItem("refresh-token");
        if (!currentRefreshToken) throw new Error("No refresh token available");

        try {
          const { accessToken, refreshToken } = await authApi.refresh({
            refreshToken: currentRefreshToken,
          });

          set({ token: accessToken });
          localStorage.setItem("refresh-token", refreshToken);
        } catch (err: any) {
          console.error("Failed to refresh token:", err);
          get().logout();
          throw err;
        }
      },
    }),
    { name: "auth-storage" }
  )
);

// initDemoUser: async (skipIfAuthPage = false) => {
//   const currentUser = useUserStore.getState().user;
//   if (skipIfAuthPage || currentUser) return;

//   try {
//     const { accessToken, user } = await authApi.login(DEMO_CREDENTIALS);
//     set({ token: accessToken });
//     useUserStore.getState().setUser(user);
//   } catch (err) {
//     console.warn("[Auth] Failed to auto-login demo user", err);
//   }
// },

//--------

// refreshToken: async () => {
//   await get().login(DEMO_CREDENTIALS);
// },
