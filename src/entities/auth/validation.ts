import { z } from "zod";

// Email: обязательное поле, латиница, стандартный формат
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .refine((val) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(val), {
    message: "Invalid email, must contain only Latin characters",
  });

// Пароль: минимум 6 символов, только латиница и цифры
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .refine((val) => /^[a-zA-Z\d!@#$%^&*()_+=-]+$/.test(val), {
    message: "Password must contain only Latin characters",
  });

// --- Схема для логина ---
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginFormData = z.infer<typeof loginSchema>;

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

// Тип автоматически выводится из схемы
export type RegisterFormData = z.infer<typeof registerSchema>;
