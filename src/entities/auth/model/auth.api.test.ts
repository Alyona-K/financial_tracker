jest.mock("@/shared/lib/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("@/entities/user/model/user.store");

import { authApi } from "./auth.api";
import { api } from "@/shared/lib/api";
import { useUserStore } from "@/entities/user/model/user.store";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "./auth.types";
import { User } from "@/entities/user/model/user.types";

const mockedApi = api as jest.Mocked<typeof api>;
const mockedUserStore = useUserStore as jest.Mocked<any>;

describe("auth.api", () => {
  const mockUser: User = {
    id: 1,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@test.com",
    avatar: "avatar.png",
    location: "NY",
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    accessToken: "token123",
  };

  const mockLogin: LoginCredentials = {
    email: "alice@test.com",
    password: "password",
  };

  const mockRegister: RegisterCredentials = {
    email: "alice@test.com",
    password: "password",
    firstName: "Alice",
    lastName: "Smith",
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockedUserStore.getState.mockReturnValue({ user: mockUser });
  });

  // --- LOGIN ---
  test("login returns AuthResponse", async () => {
    mockedApi.post.mockResolvedValueOnce({ data: mockAuthResponse });
    const result = await authApi.login(mockLogin);
    expect(result).toEqual(mockAuthResponse);
    expect(mockedApi.post).toHaveBeenCalledWith("/login", mockLogin);
  });

  test("login throws if api fails", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("Login failed"));
    await expect(authApi.login(mockLogin)).rejects.toThrow("Login failed");
  });

  // --- REGISTER ---
  test("register returns AuthResponse", async () => {
    mockedApi.post.mockResolvedValueOnce({ data: mockAuthResponse });
    const result = await authApi.register(mockRegister);
    expect(result).toEqual(mockAuthResponse);
    expect(mockedApi.post).toHaveBeenCalledWith("/register", mockRegister);
  });

  test("register throws if api fails", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("Register failed"));
    await expect(authApi.register(mockRegister)).rejects.toThrow(
      "Register failed"
    );
  });

  // --- GET CURRENT USER ---
  test("getCurrentUser returns user from store", async () => {
    const result = await authApi.getCurrentUser();
    expect(result).toEqual(mockUser);
  });

  test("getCurrentUser throws if no user in store", async () => {
    mockedUserStore.getState.mockReturnValue({ user: null });
    await expect(authApi.getCurrentUser()).rejects.toThrow(
      "User not logged in"
    );
  });
});
