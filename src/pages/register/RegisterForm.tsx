import { useState } from "react";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register attempt:", form);
    // TODO: интеграция с API (auth.api.ts)
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-form__label">
        Name
        <input
          className="auth-form__input"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label className="auth-form__label">
        Email
        <input
          className="auth-form__input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>

      <label className="auth-form__label">
        Password
        <input
          className="auth-form__input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </label>

      <button className="auth-form__button" type="submit">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;