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


//--------------------

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { authApi } from "./auth.api";
// import type { User, LoginCredentials } from "./auth.types";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   error: string | null;

//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
//   initDemoUser: () => Promise<void>;
// }

// const DEMO_CREDENTIALS: LoginCredentials = {
//   email: "demo@fintrack.com",
//   password: "demo123",
// };

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       isLoading: false,
//       error: null,

//       login: async ({ email, password }) => {
//         set({ isLoading: true, error: null });
//         try {
//           const { accessToken, user } = await authApi.login({ email, password });
//           set({ user, token: accessToken, isLoading: false });
//         } catch (err: any) {
//           set({ error: err.response?.data?.message || "Failed to log in", isLoading: false });
//         }
//       },

//       logout: () => set({ user: null, token: null }),

//       initDemoUser: async () => {
//         // Если пользователь уже в стора (persist), не логиним
//         const { user, token } = get();
//         if (user && token) return;

//         try {
//           await get().login(DEMO_CREDENTIALS);
//         } catch {
//           console.warn("Failed to login demo user");
//         }
//       },
//     }),
//     { name: "auth-storage" }
//   )
// );

//-----------------
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { authApi } from "./auth.api";
// import type { User, LoginCredentials } from "./auth.types";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   error: string | null;

//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
//   getCurrentUser: () => Promise<void>;
// }

// const DEMO_USER: User = { id: 1, email: "demo@fintrack.com", name: "Julia Bennett" };

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: DEMO_USER,
//       token: "demo-token",
//       isLoading: false,
//       error: null,

//       login: async ({ email, password }) => {
//         set({ isLoading: true, error: null });
//         try {
//           const { accessToken, user } = await authApi.login({ email, password });
//           set({ user, token: accessToken, isLoading: false });
//         } catch (err: any) {
//           set({ error: err.response?.data?.message || "Failed to log in", isLoading: false });
//         }
//       },

//       logout: () => {
//         // При logout можно возвращать демо-пользователя или null
//         set({ user: DEMO_USER, token: "demo-token" });
//       },

//       getCurrentUser: async () => {
//         const token = get().token;
//         if (!token || token === "demo-token") return;

//         try {
//           const user = await authApi.getCurrentUser(token);
//           set({ user });
//         } catch {
//           set({ user: DEMO_USER, token: "demo-token" });
//         }
//       },
//     }),
//     { name: "auth-storage" }
//   )
// );

//----------------


// import { create } from "zustand";
// import { authApi } from "./auth.api";
// import type { User } from "./auth.types";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   error: string | null;

//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   getCurrentUser: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   user: null,
//   token: localStorage.getItem("token"),
//   isLoading: false,
//   error: null,

//   login: async (email, password) => {
//     try {
//       set({ isLoading: true, error: null });
//       const { accessToken, user } = await authApi.login({ email, password });

//       localStorage.setItem("token", accessToken);
// set({ user, token: accessToken, isLoading: false });
//     } catch (err: any) {
//       set({
//         error: err.response?.data?.message || "Failed to log in",
//         isLoading: false,
//       });
//     }
//   },

//   logout: () => {
//     localStorage.removeItem("token");
//     set({ user: null, token: null, error: null });
//   },

//   getCurrentUser: async () => {
//     const token = get().token;
//     if (!token) return;

//     try {
//       const user = await authApi.getCurrentUser(token);
//       set({ user });
//     } catch {
//       set({ user: null, token: null });
//       localStorage.removeItem("token");
//     }
//   },
// }));