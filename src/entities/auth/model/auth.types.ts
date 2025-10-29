import type { User } from "@/entities/user/model/user.types";

export interface AuthResponse {
  accessToken: string; // <-- важно: json-server-auth возвращает accessToken
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}
