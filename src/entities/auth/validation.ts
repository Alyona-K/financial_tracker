import { z } from "zod";

// --- FIELD SCHEMAS ---
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .superRefine((val, ctx) => {
    if (val && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid email",
      });
    }
  });

const passwordSchema = z
  .string()
  .superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Password is required",
      });
    } else if (val.length < 6) {
      ctx.addIssue({
        code: "custom",
        message: "Password must be at least 6 characters",
      });
    } else if (!/^[a-zA-Z\d!@#$%^&*()_+=-]+$/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid password",
      });
    }
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
