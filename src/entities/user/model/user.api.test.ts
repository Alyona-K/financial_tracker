jest.mock("@/shared/lib/api", () => ({
  api: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

import { userApi } from "./user.api";
import { api } from "@/shared/lib/api";
import type { User, UpdateUserPayload } from "./user.types";

const mockedApi = api as jest.Mocked<typeof api>;

describe("user.api", () => {
  const mockUser: User = {
    id: 1,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@test.com",
    avatar: "avatar.png",
    location: "NY",
  };

  const mockUpdatePayload: UpdateUserPayload = {
    firstName: "Alicia",
    lastName: "S.",
    avatar: "new_avatar.png",
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  // --- GET BY ID ---
  test("getById returns a user", async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockUser });
    const result = await userApi.getById(mockUser.id);
    expect(result).toEqual(mockUser);
    expect(mockedApi.get).toHaveBeenCalledWith(`/users/${mockUser.id}`);
  });

  test("getById throws if api fails", async () => {
    mockedApi.get.mockRejectedValueOnce(new Error("Fetch failed"));
    await expect(userApi.getById(mockUser.id)).rejects.toThrow("Fetch failed");
  });

  // --- UPDATE ---
  test("update returns updated user", async () => {
    const updatedUser: User = { ...mockUser, ...mockUpdatePayload };
    mockedApi.patch.mockResolvedValueOnce({ data: updatedUser });
    const result = await userApi.update(mockUser.id, mockUpdatePayload);
    expect(result).toEqual(updatedUser);
    expect(mockedApi.patch).toHaveBeenCalledWith(
      `/users/${mockUser.id}`,
      mockUpdatePayload
    );
  });

  test("update throws if api fails", async () => {
    mockedApi.patch.mockRejectedValueOnce(new Error("Update failed"));
    await expect(
      userApi.update(mockUser.id, mockUpdatePayload)
    ).rejects.toThrow("Update failed");
  });

  // --- EDGE CASE ---
  test("update with empty payload returns user unchanged", async () => {
    mockedApi.patch.mockResolvedValueOnce({ data: mockUser });
    const result = await userApi.update(mockUser.id, {});
    expect(result).toEqual(mockUser);
    expect(mockedApi.patch).toHaveBeenCalledWith(`/users/${mockUser.id}`, {});
  });
});
