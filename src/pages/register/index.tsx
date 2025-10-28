import RegisterForm from "./ui/RegisterForm";
import Welcome from "./ui/Welcome";
import "./RegisterPage.css";

const RegisterPage = () => {
  return (
    <section className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__wrap">
          <Welcome />
          <RegisterForm />
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
