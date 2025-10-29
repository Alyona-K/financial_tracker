import { api } from "@/shared/lib/api";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "./auth.types";
import { useUserStore } from "@/entities/user/model/user.store";

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
    const { user } = useUserStore.getState();
    if (!user) throw new Error("User not logged in");
    return user;
  },
};




