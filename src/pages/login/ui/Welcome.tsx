import logo from "@/assets/images/fintrack-logo.png";
import { NavLink } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
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
      <h2 className="auth-page__title">Sign in to Your Account</h2>
      <p className="auth-page__text">
        Welcome back! Log in to unlock exclusive features tailored to your
        financial needs.
      </p>
    </div>
  );
}

export default Welcome;
