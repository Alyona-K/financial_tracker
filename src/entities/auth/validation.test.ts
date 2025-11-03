import { loginSchema, registerSchema } from "./validation";

describe("loginSchema", () => {
  it("passes with valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "securePass123",
    });
    expect(result.success).toBe(true);
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
