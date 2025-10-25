import LoginForm from "./ui/LoginForm";
import Welcome from "./ui/Welcome";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-page__wrap">
          <Welcome />
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
