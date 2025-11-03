import { useAuthStore } from "@/entities/auth/model/auth.store";
import { clearUserData } from "@/shared/lib/clearUserData";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/shared/ui/AuthForm";
import { registerSchema, RegisterFormData } from "@/entities/auth/validation";

const RegisterForm = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const apiError = useAuthStore((state) => state.error);

  const handleRegisterSubmit = async (form: RegisterFormData) => {
    clearUserData();
    await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    });
    navigate("/overview");
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
        },
        {
          name: "password",
          label: "Password",
          placeholder: "Enter your password",
          type: "password",
          required: true,
        },
        {
          name: "confirmPassword",
          label: "Confirm password",
          placeholder: "Repeat your password",
          type: "password",
          required: true,
        },
      ]}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={registerSchema}
      onSubmit={handleRegisterSubmit}
      submitLabel="Register"
      isLoading={isLoading}
      apiError={apiError}
    />
  );
};

export default RegisterForm;


