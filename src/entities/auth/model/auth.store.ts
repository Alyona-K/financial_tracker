import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "./auth.api";
import type { User, LoginCredentials, RegisterCredentials } from "./auth.types";

interface AuthState {
  user: User | null;
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
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authApi.login({
            email,
            password,
          });
          set({ user, token: accessToken, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Failed to log in",
            isLoading: false,
          });
          throw err;
        }
      },

      register: async ({ name, email, password }: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const { accessToken, user } = await authApi.register({
            name,
            email,
            password,
          });
          set({ user, token: accessToken, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Failed to register",
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => set({ user: null, token: null }),

      initDemoUser: async (skipIfAuthPage = false) => {
        if (skipIfAuthPage) return; // не логиним на /login или /register

        try {
          console.log("[Auth] Auto login as demo user...");
          // сброс предыдущего пользователя перед демо
          set({ user: null, token: null });
          const { accessToken, user } = await authApi.login(DEMO_CREDENTIALS);
          set({ user, token: accessToken });
        } catch (err) {
          console.warn("[Auth] Failed to auto-login demo user", err);
        }
      },

      // initDemoUser: async (skipIfAuthPage = false) => {
      //   const { user, token } = get();
      //   if (user && token) return;

      //   if (skipIfAuthPage) return; // не логиним демо на /login или /register

      //   try {
      //     await get().login(DEMO_CREDENTIALS);
      //   } catch {
      //     console.warn("Failed to login demo user");
      //   }
      // },

      // метод для “рефреша” токена при 401
      refreshToken: async () => {
        console.log("Refreshing demo token...");
        await get().login(DEMO_CREDENTIALS);
      },
    }),
    { name: "auth-storage" }
  )
);

// initDemoUser: async (skipIfAuthPage = false) => {
//   const { user, token } = get();
//   if (user && token) return;

//   if (skipIfAuthPage) return; // не логиним демо на /login или /register

//   try {
//     await get().login(DEMO_CREDENTIALS);
//   } catch {
//     console.warn("Failed to login demo user");
//   }
// },

//-------------

// initDemoUser: async () => {
//   const { user, token } = get();
//   if (user && token) return;
//   try {
//     await get().login(DEMO_CREDENTIALS);
//   } catch {
//     console.warn("Failed to login demo user");
//   }
// },

//-------------------------

// import { create } from "zustand";
// import { persist, subscribeWithSelector } from "zustand/middleware";
// import { authApi } from "./auth.api";
// import type { User, LoginCredentials } from "./auth.types";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   error: string | null;
//   isDemo: boolean;
//   isInitialized: boolean;

//   login: (credentials: LoginCredentials) => Promise<void>;
//   logout: () => void;
//   initDemoUser: () => Promise<void>;
//   refreshToken: () => Promise<void>; // новый метод для автологина
// }

// const DEMO_CREDENTIALS: LoginCredentials = {
//   email: "demo@fintrack.com",
//   password: "demo123",
// };

// // Токен демо можно взять один раз после логина локально или задать заранее
// const DEMO_USER = {
//   id: 1,
//   email: "demo@fintrack.com",
//   name: "Julia Bennett",
// };
// const DEMO_TOKEN = "demo-token-123"; // json-server-auth токен не нужен на SSR, просто чтобы axios не падал

// export const useAuthStore = create<AuthState>()(
//   subscribeWithSelector(
//     persist(
//       (set, get) => ({
//         user: null,
//         token: null,
//         isLoading: false,
//         error: null,
//         isDemo: false,
//         isInitialized: false,

//         login: async (credentials) => {
//           set({ isLoading: true, error: null });
//           try {
//             const { accessToken, user } = await authApi.login(credentials);
//             set({
//               user,
//               token: accessToken,
//               isDemo: false,
//               isInitialized: true,
//               isLoading: false,
//             });
//           } catch (err: any) {
//             set({
//               error: err.response?.data?.message || "Failed to log in",
//               isLoading: false,
//             });
//             throw err;
//           }
//         },
//         logout: () =>
//           set({ user: null, token: null, isDemo: false, isInitialized: false }),

//         initDemoUser: async () => {
//           // SSR: просто ставим демо без API-запроса
//           if (typeof window === "undefined") {
//             set({
//               user: DEMO_USER,
//               token: DEMO_TOKEN,
//               isDemo: true,
//               isInitialized: true,
//             });
//             return;
//           }
//           const { user, token } = get();
//           if (user && token) {
//             try {
//               await authApi.verify();
//               set({ isInitialized: true });
//               return;
//             } catch {
//               console.warn("Token expired, relogging demo user...");
//             }
//           }

//           try {
//             const { accessToken, user } = await authApi.login(DEMO_CREDENTIALS);
//             set({
//               user,
//               token: accessToken,
//               isDemo: true,
//               isInitialized: true,
//             });
//           } catch {
//             console.warn("Failed to login demo user");
//             set({ isInitialized: true });
//           }
//         },

//         refreshToken: async () => {
//           const { isDemo } = get();
//           if (isDemo) return; // demo не требует refresh
//           console.log("Refreshing real token...");
//           // здесь реальный flow для production
//         },
//       }),
//       { name: "auth-storage" }
//     )
//   )
// );
