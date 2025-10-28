import { useState } from "react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { clearUserData } from "@/shared/lib/clearUserData";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const apiError = useAuthStore((state) => state.error);

  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

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

    try {
      clearUserData(); 
      await register(form);
      console.log("Registration successful, stores cleared");
      navigate("/overview");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* --- NAME --- */}
      <div className="auth-form__input-container">
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          wrapperClassName="auth-form__input-wrap"
          labelClassName="auth-form__label"
          fieldClassName="auth-form__field"
        />
        {errors.name && <span className="auth-form__error">{errors.name}</span>}
      </div>

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
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
