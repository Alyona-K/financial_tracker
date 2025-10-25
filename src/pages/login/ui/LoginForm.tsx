import { useState } from "react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import "./LoginForm.css";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const apiError = useAuthStore((state) => state.error);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await login({ email: form.email, password: form.password });
    console.log("Login successful");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* --- EMAIL --- */}
      <div className="auth-form__input-container">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          wrapperClassName="auth-form__input-wrap"
          labelClassName="auth-form__label"
          fieldClassName="auth-form__field"
        />
        {errors.email && (
          <span className="auth-form__error">{errors.email}</span>
        )}
      </div>

      {/* --- PASSWORD --- */}
      <div className="auth-form__input-container">
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          wrapperClassName="auth-form__input-wrap"
          labelClassName="auth-form__label"
          fieldClassName="auth-form__field"
        />
        {errors.password && (
          <span className="auth-form__error">{errors.password}</span>
        )}
      </div>

      {/* --- API ERROR --- */}
      {apiError && (
        <div className="auth-form__error auth-form__error--api">{apiError}</div>
      )}

      {/* --- BUTTON --- */}
      <Button
        className="btn auth-form__button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
};

export default LoginForm;
