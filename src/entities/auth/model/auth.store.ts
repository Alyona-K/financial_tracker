import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "./auth.api";
import type { User, LoginCredentials } from "./auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

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
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authApi.login({ email, password });
          set({ user, token: accessToken, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Failed to log in",
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => set({ user: null, token: null }),

      initDemoUser: async () => {
        const { user, token } = get();
        if (user && token) return;
        try {
          await get().login(DEMO_CREDENTIALS);
        } catch {
          console.warn("Failed to login demo user");
        }
      },

      // метод для “рефреша” токена при 401
      refreshToken: async () => {
        console.log("Refreshing demo token...");
        await get().login(DEMO_CREDENTIALS);
      },
    }),
    { name: "auth-storage" }
  )
);

