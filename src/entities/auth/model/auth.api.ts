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

async verify(): Promise<boolean> {
  try {
    // Просто пробуем получить список транзакций —
    // если 401, значит токен мёртв.
    await api.get("/transactions");
    return true;
  } catch {
    return false;
  }
}
};

