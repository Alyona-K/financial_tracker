import logo from "@/assets/images/fintrack-logo.png";
import { NavLink } from "react-router-dom";
import "./AuthWelcome.css";

interface AuthWelcomeProps {
  title: string;
  text: string;
}

export function AuthWelcome({ title, text }: AuthWelcomeProps) {
  return (
    <div className="auth-page__welcome">
      <NavLink className="auth-page__logo" to="/" aria-label="Main page link">
        <img
          className="auth-page__logo-img"
          src={logo}
          alt="FinTrack logo"
          width={176}
          height={55}
        />
      </NavLink>

      <h2 className="auth-page__title">{title}</h2>
      <p className="auth-page__text">{text}</p>
    </div>
  );
}
