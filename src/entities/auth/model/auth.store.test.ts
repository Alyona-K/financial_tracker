// --- API & STORE MOCKS ---
jest.mock("@/shared/lib/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock("@/shared/config/config", () => ({
  API_URL: "http://localhost:3001",
}));

jest.mock("./auth.api");
const setUserMock = jest.fn();
const userStoreMock = {
  getState: () => ({
    user: null,
    setUser: setUserMock,
    fetchUser: jest.fn(),
    updateUser: jest.fn(),
  }),
};

jest.mock("@/entities/user/model/user.store", () => ({
  useUserStore: userStoreMock,
}));

// --- IMPORTS ---
import { act } from "@testing-library/react";
import { useAuthStore } from "./auth.store";
import { useUserStore } from "@/entities/user/model/user.store";
import { authApi } from "./auth.api";

// --- TESTS: AUTH STORE ---
describe("Auth Store", () => {
  const mockUser = {
    id: 1,
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
    avatar: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().logout(true); 
    (useUserStore.getState().setUser as jest.Mock).mockImplementation(() => {});
  });

  // --- LOGIN ---
  it("should login successfully and set token and user", async () => {
    (authApi.login as jest.Mock).mockResolvedValue({
      accessToken: "abc123",
      user: mockUser,
    });

    await act(async () => {
      await useAuthStore
        .getState()
        .login({ email: "test@test.com", password: "123" });
    });

    expect(useAuthStore.getState().token).toBe("abc123");
    expect(useUserStore.getState().setUser).toHaveBeenCalledWith(mockUser);
  });

  it("should handle login error", async () => {
    const error = { response: { data: { message: "Invalid credentials" } } };
    (authApi.login as jest.Mock).mockRejectedValue(error);

    await expect(
      act(async () => {
        await useAuthStore
          .getState()
          .login({ email: "fail@test.com", password: "123" });
      })
    ).rejects.toEqual(error);

    expect(useAuthStore.getState().error).toBe("Invalid credentials");
  });

  // --- REGISTER ---
  it("should register successfully and set token and user", async () => {
    (authApi.register as jest.Mock).mockResolvedValue({
      accessToken: "reg123",
      user: mockUser,
    });

    await act(async () => {
      await useAuthStore.getState().register({
        email: "new@test.com",
        password: "123",
        firstName: "T",
        lastName: "U",
      });
    });

    expect(useAuthStore.getState().token).toBe("reg123");
    expect(useUserStore.getState().setUser).toHaveBeenCalledWith(mockUser);
  });

  // --- LOGOUT ---
  it("should logout and clear token and user", () => {
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useUserStore.getState().setUser).toHaveBeenCalledWith(null);
    expect(useAuthStore.getState().skipAutoLogin).toBe(true);
  });

  // --- INIT DEMO USER ---
  it("should init demo user if no user exists", async () => {
    (authApi.login as jest.Mock).mockResolvedValue({
      accessToken: "demo123",
      user: mockUser,
    });

    await act(async () => {
      await useAuthStore.getState().initDemoUser();
    });

    expect(useAuthStore.getState().token).toBe("demo123");
    expect(useUserStore.getState().setUser).toHaveBeenCalledWith(mockUser);
  });

  it("should not init demo user if skipIfAuthPage is true", async () => {
    await useAuthStore.getState().initDemoUser(true);
    expect(authApi.login).not.toHaveBeenCalled();
  });

  // --- REFRESH TOKEN ---
  it("should refresh token using demo credentials", async () => {
    (useAuthStore.getState().login as jest.Mock) = jest
      .fn()
      .mockResolvedValue(undefined);

    await useAuthStore.getState().refreshToken();
    expect(useAuthStore.getState().login).toHaveBeenCalledWith({
      email: "demo@fintrack.com",
      password: "demo123",
    });
  });
});
