import { api } from "@/shared/lib/api";
import type { User, UpdateUserPayload } from "./user.types";
import bcrypt from "bcryptjs";

export const userApi = {
  async getById(id: number): Promise<User> {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },

  async changePassword(userId: number, newPassword: string) {
    // PATCH только password
    const updated = await api.patch(`/users/${userId}`, { password: newPassword });
    return updated.data;
  }
};
