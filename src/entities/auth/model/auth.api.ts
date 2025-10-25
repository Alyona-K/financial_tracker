import { api } from "@/shared/lib/api";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "./auth.types";
import { useAuthStore } from "@/entities/auth/model/auth.store"

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/login", credentials);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/register", credentials);
    return data;
  },

  // для демо-пользователя достаточно логина, /me json-server-auth не поддерживает
  async getCurrentUser(): Promise<AuthResponse["user"]> {
    // Возвращаем user из стора, токен уже в интерцепторе
    const { user } = useAuthStore.getState();
    if (!user) throw new Error("User not logged in");
    return user;
  },
};


//-------------------------

// import axios from "axios";
// import {
//   AuthResponse,
//   LoginCredentials,
//   RegisterCredentials,
// } from "./auth.types";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// export const authApi = {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     // POST /login → возвращает { accessToken, user: { id, email, name } }
//     const { data } = await axios.post<AuthResponse>(
//       `${API_URL}/login`,
//       credentials
//     );
//     return data;
//   },

//   async register(credentials: RegisterCredentials): Promise<AuthResponse> {
//     // POST /register → возвращает { accessToken, user: { id, email, name } }
//     const { data } = await axios.post<AuthResponse>(
//       `${API_URL}/register`,
//       credentials
//     );
//     return data;
//   },

//   // json-server-auth не поддерживает /me — этот метод можно убрать или мокнуть
//   async getCurrentUser(token: string): Promise<AuthResponse["user"]> {
//     try {
//       const { data } = await axios.get<AuthResponse["user"]>(
//         `${API_URL}/users`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       // Но этот запрос вернёт массив всех пользователей, не текущего
//       return data;
//     } catch {
//       throw new Error("getCurrentUser is not supported by json-server-auth");
//     }
//   },
// };

//-----------------------

// import axios from "axios";
// import { AuthResponse, LoginCredentials, RegisterCredentials } from "./auth.types";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// export const authApi = {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     const { data } = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
//     return data;
//   },

//   async register(credentials: RegisterCredentials): Promise<AuthResponse> {
//     const { data } = await axios.post<AuthResponse>(`${API_URL}/register`, credentials);
//     return data;
//   },

//   async getCurrentUser(token: string): Promise<AuthResponse["user"]> {
//     const { data } = await axios.get<AuthResponse["user"]>(`${API_URL}/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return data;
//   },
// };
