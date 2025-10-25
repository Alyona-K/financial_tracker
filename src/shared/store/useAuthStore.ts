// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface AuthUser {
//   id: number;
//   email: string;
//   name?: string;
// }

// interface AuthState {
//   user: AuthUser | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       // дефолтный "залогиненный" пользователь (демо)
//       user: { id: 1, email: "demo@fintrack.com", name: "Julia Bennett" },
//       token: "demo-token",

//       login: async (email, password) => {
//         const res = await fetch("http://localhost:3001/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         });

//         if (!res.ok) throw new Error("Invalid credentials");

//         const data: { accessToken: string; user: AuthUser } = await res.json();

//         // json-server-auth возвращает { accessToken, user: { id, email, name } }
//         set({
//           user: data.user,
//           token: data.accessToken,
//         });
//       },

//       logout: () => {
//         set({ user: null, token: null });
//       },
//     }),
//     { name: "auth-storage" }
//   )
// );

// interface AuthState {
//   user: { email: string; name?: string } | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

      // user: null,
      // token: null,

//       import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface AuthUser {
//   id: number;
//   email: string;
//   name?: string;
// }

// interface AuthState {
//   user: AuthUser | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       // ← дефолтный "залогиненный" пользователь
//       user: { email: "demo@fintrack.com", name: "Julia Bennett" },
//       token: "demo-token",

//       login: async (email, password) => {
//         const res = await fetch("http://localhost:3001/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         });

//         if (!res.ok) throw new Error("Invalid credentials");

//         const data = await res.json();
//         set({ user: { email: data.user.email }, token: data.accessToken });
//       },

//       logout: () => {
//         set({ user: null, token: null });
//       },
//     }),
//     { name: "auth-storage" }
//   )
// );
