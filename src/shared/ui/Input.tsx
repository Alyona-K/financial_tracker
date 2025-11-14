import React from "react";
import sprite from "@/assets/images/sprite.svg";
import "./Input.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  label?: string;
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
}

const Input: React.FC<InputProps> = ({
  icon,
  label,
  id,
  wrapperClassName = "",
  fieldClassName = "",
  labelClassName = "",
  iconClassName = "",
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div
      className={`custom-input ${icon ? "custom-input--icon" : ""} ${wrapperClassName}`}
    >
      <input
        className={`custom-input__field ${fieldClassName}`}
        id={inputId}
        {...props}
      />
      {label && (
        <label className={`custom-input__label ${labelClassName}`} htmlFor={inputId}>
          <span className="custom-input__label-text">{label}</span>
        </label>
      )}
      {icon && (
        <svg
          className={`custom-input__icon ${iconClassName}`}
          width={24}
          height={24}
          aria-hidden="true"
        >
          <use xlinkHref={`${sprite}#${icon}`} />
        </svg>
      )}
    </div>
  );
};

export default Input;




