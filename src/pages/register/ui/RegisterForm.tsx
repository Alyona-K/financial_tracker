import { useAuthStore } from "@/entities/auth/model/auth.store";
import { clearUserData } from "@/shared/lib/clearUserData";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/shared/ui/AuthForm";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const apiError = useAuthStore((state) => state.error);

  const handleRegisterSubmit = async (form: RegisterFormData) => {
    clearUserData(); // очистка стора
    await register(form); // вызов стора
    navigate("/overview"); // редирект
  };
  return (
    <AuthForm<RegisterFormData>
      fields={[
        {
          name: "firstName",
          label: "First name",
          placeholder: "Enter your first name",
          required: true,
        },
        {
          name: "lastName",
          label: "Last name",
          placeholder: "Enter your last name",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          placeholder: "Enter your email",
          type: "email",
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
      initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
      onSubmit={handleRegisterSubmit}
      submitLabel="Register"
      isLoading={isLoading}
      apiError={apiError}
    />
  );
};

export default RegisterForm;
