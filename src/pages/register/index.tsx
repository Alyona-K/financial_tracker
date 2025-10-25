import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <section className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">Register</h1>
        <RegisterForm />
      </div>
    </section>
  );
};

export default RegisterPage;