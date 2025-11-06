import { z } from "zod";

// --- FIELD SCHEMAS ---
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .refine((val) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(val), {
    message: "Invalid email, must contain only Latin characters",
  });

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .refine((val) => /^[a-zA-Z\d!@#$%^&*()_+=-]+$/.test(val), {
    message: "Password must contain only Latin characters",
  });

// --- LOGIN SCHEMA ---
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginFormData = z.infer<typeof loginSchema>;

// --- REGISTER SCHEMA ---
export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
