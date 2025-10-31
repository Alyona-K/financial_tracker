import { useAuthStore } from "@/entities/auth/model/auth.store";
import { clearUserData } from "@/shared/lib/clearUserData";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/shared/ui/AuthForm";
import { loginSchema, LoginFormData } from "@/entities/auth/validation";

const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const apiError = useAuthStore((state) => state.error);

  const handleLoginSubmit = async (form: LoginFormData) => {
    clearUserData();
    await login({
      email: form.email,
      password: form.password,
    });
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
        },
        {
          name: "password",
          label: "Password",
          placeholder: "Enter your password",
          type: "password",
          required: true,
        },
      ]}
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={loginSchema}
      onSubmit={handleLoginSubmit}
      submitLabel="Log in"
      isLoading={isLoading}
      apiError={apiError}
    />
  );
};

export default LoginForm;
