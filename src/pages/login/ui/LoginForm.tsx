import { useAuthStore } from "@/entities/auth/model/auth.store";
import { clearUserData } from "@/shared/lib/clearUserData";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/shared/ui/AuthForm";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const apiError = useAuthStore((state) => state.error);

  const handleLoginSubmit = async (form: LoginFormData) => {
    clearUserData();
    await login(form);
    navigate("/overview");
  };

  return (
    <AuthForm<LoginFormData>
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
          required: true,
          validator: (v) => (/\S+@\S+\.\S+/.test(v) ? null : "Invalid email"),
        },
        {
          name: "password",
          label: "Password",
          placeholder: "Enter your password",
          type: "password",
          required: true,
          validator: (v) =>
            v.length >= 6 ? null : "Password must be at least 6 characters",
        },
      ]}
      initialValues={{ email: "", password: "" }}
      onSubmit={handleLoginSubmit}
      submitLabel="Log in"
      isLoading={isLoading}
      apiError={apiError}
    />
  );
};

export default LoginForm;
