import RegisterForm from "./ui/RegisterForm";
import { AuthWelcome } from "@/shared/ui/AuthWelcome";
import "./RegisterPage.scss";

const RegisterPage = () => {
  return (
    <section className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__wrap">
          <AuthWelcome
            title="Create Your Account"
            text="Join FinTrack today! Sign up to manage your finances and track your transactions seamlessly."
          />
          <RegisterForm />
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
