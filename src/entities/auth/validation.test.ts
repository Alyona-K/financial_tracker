import { loginSchema, registerSchema } from "./validation";

// --- LOGIN SCHEMA TESTS ---
describe("loginSchema", () => {
  it("passes with valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "securePass123",
    });
    expect(result.success).toBe(true);
  });

  it("fails if email is empty", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "securePass123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === "Email is required")
      ).toBe(true);
    }
  });

  it("fails if email is invalid", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "securePass123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Invalid email");
    }
  });

  it("fails if password is empty", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === "Password is required")
      ).toBe(true);
    }
  });

  it("fails if password too short", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 6 characters");
    }
  });
});

// --- REGISTER SCHEMA TESTS ---
describe("registerSchema", () => {
  it("passes when all fields valid", () => {
    const result = registerSchema.safeParse({
      firstName: "Alena",
      lastName: "Petrova",
      email: "alena@example.com",
      password: "Pass123",
      confirmPassword: "Pass123",
    });
    expect(result.success).toBe(true);
  });

  it("fails when firstName is empty", () => {
    const result = registerSchema.safeParse({
      firstName: "",
      lastName: "Petrova",
      email: "alena@example.com",
      password: "Pass123",
      confirmPassword: "Pass123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === "First name is required")
      ).toBe(true);
    }
  });

  it("fails when passwords don't match", () => {
    const result = registerSchema.safeParse({
      firstName: "Alena",
      lastName: "Petrova",
      email: "alena@example.com",
      password: "Pass123",
      confirmPassword: "Wrong123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === "Passwords must match")
      ).toBe(true);
    }
  });
});
