import React from "react";
import "./Button.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <button className={`btn ${className}`} {...props}>
      <span className="btn__text">{children}</span>
    </button>
  );
};

export default Button;
