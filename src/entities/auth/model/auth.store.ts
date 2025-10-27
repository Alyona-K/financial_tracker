import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { authApi } from "./auth.api";
import type { User, LoginCredentials } from "./auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isDemo: boolean;
  isInitialized: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  initDemoUser: () => Promise<void>;
  refreshToken: () => Promise<void>; // новый метод для автологина
}

const DEMO_CREDENTIALS: LoginCredentials = {
  email: "demo@fintrack.com",
  password: "demo123",
};

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isDemo: false,
        isInitialized: false,

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            const { accessToken, user } = await authApi.login(credentials);
            set({
              user,
              token: accessToken,
              isDemo: false,
              isInitialized: true,
              isLoading: false,
            });
          } catch (err: any) {
            set({
              error: err.response?.data?.message || "Failed to log in",
              isLoading: false,
            });
            throw err;
          }
        },
        logout: () =>
          set({ user: null, token: null, isDemo: false, isInitialized: false }),

        initDemoUser: async () => {
          const { user, token } = get();
          if (user && token) {
            try {
              await authApi.verify(); 
              set({ isInitialized: true });
              return;
            } catch {
              console.warn("Token expired, relogging demo user...");
            }
          }

          try {
            const { accessToken, user } = await authApi.login(DEMO_CREDENTIALS);
            set({
              user,
              token: accessToken,
              isDemo: true,
              isInitialized: true,
            });
          } catch {
            console.warn("Failed to login demo user");
            set({ isInitialized: true });
          }
        },

        refreshToken: async () => {
          const { isDemo } = get();
          if (isDemo) return; // demo не требует refresh
          console.log("Refreshing real token...");
          // здесь реальный flow для production
        },
      }),
      { name: "auth-storage" }
    )
  )
);
