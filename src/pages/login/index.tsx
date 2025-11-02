import LoginForm from "./ui/LoginForm";
import { AuthWelcome } from "@/shared/ui/AuthWelcome";
import "./LoginPage.scss";

const LoginPage = () => {
  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-page__wrap">
          <AuthWelcome
            title="Sign in to Your Account"
            text="Welcome back! Log in to unlock exclusive features tailored to your financial needs."
          />
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
