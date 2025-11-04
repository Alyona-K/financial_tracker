// --- Моки API и конфигов ---
jest.mock("@/shared/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));

// --- Мок userApi ---
jest.mock("./user.api");

import { act } from "@testing-library/react";
import { useUserStore } from "./user.store";
import { userApi } from "./user.api";

describe("User Store", () => {
  const mockUser = {
    id: 1,
    email: "user@test.com",
    firstName: "Test",
    lastName: "User",
    avatar: "",
  };

  const updatedUser = {
    ...mockUser,
    firstName: "Updated",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.getState().setUser(null); // сбросим состояние между тестами
  });

  it("should set user", () => {
    act(() => {
      useUserStore.getState().setUser(mockUser);
    });

    expect(useUserStore.getState().user).toEqual(mockUser);
  });

  it("should fetch user by id", async () => {
    (userApi.getById as jest.Mock).mockResolvedValue(mockUser);

    await act(async () => {
      await useUserStore.getState().fetchUser(1);
    });

    expect(userApi.getById).toHaveBeenCalledWith(1);
    expect(useUserStore.getState().user).toEqual(mockUser);
  });

  it("should update user when user exists", async () => {
    act(() => {
      useUserStore.getState().setUser(mockUser);
    });

    (userApi.update as jest.Mock).mockResolvedValue(updatedUser);

    await act(async () => {
      await useUserStore.getState().updateUser({ firstName: "Updated" });
    });

    expect(userApi.update).toHaveBeenCalledWith(mockUser.id, {
      firstName: "Updated",
    });
    expect(useUserStore.getState().user).toEqual(updatedUser);
  });

  it("should not update user if no user exists", async () => {
    (userApi.update as jest.Mock).mockResolvedValue(updatedUser);

    await act(async () => {
      await useUserStore.getState().updateUser({ firstName: "Updated" });
    });

    expect(userApi.update).not.toHaveBeenCalled();
    expect(useUserStore.getState().user).toBeNull();
  });
});
