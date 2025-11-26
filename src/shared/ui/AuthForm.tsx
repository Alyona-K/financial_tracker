import React, { useState } from "react";
import { z } from "zod";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import sprite from "@/assets/images/sprite.svg";
import "./AuthForm.scss";

interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validator?: (value: string) => string | null;
}

interface AuthFormProps<T> {
  fields: FieldConfig[];
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  submitLabel: string;
  isLoading?: boolean;
  apiError?: string | null;
  validationSchema?: z.ZodSchema<T>;
}

function AuthForm<T extends Record<string, any>>({
  fields,
  initialValues,
  onSubmit,
  submitLabel,
  isLoading,
  apiError,
  validationSchema,
}: AuthFormProps<T>) {
  const [form, setForm] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof T, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    if (validationSchema) {
      const result = validationSchema.safeParse(form);
      if (!result.success) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) {
            newErrors[path as keyof T] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
      setErrors({});
      return true;
    } else {
      const newErrors: Partial<Record<keyof T, string>> = {};
      fields.forEach((f) => {
        const value = form[f.name as keyof T];
        if (f.required && !value?.trim())
          newErrors[f.name as keyof T] = `${f.label} is required`;
        else if (f.validator) {
          const err = f.validator(value);
          if (err) newErrors[f.name as keyof T] = err;
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit(form);
    } catch (err) {
      console.warn("Login/register failed:", err);
    }
  };

  const toggleShowPassword = (fieldName: string) => {
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {fields.map((f) => {
        const isPassword = f.type === "password";
        const inputType =
          isPassword && showPassword[f.name] ? "text" : f.type || "text";

        return (
          <div className="auth-form__input-container" key={f.name}>
            <div className="auth-form__input-wrap">
              <Input
                label={f.label}
                type={inputType}
                placeholder={f.placeholder}
                value={form[f.name as keyof T] || ""}
                onChange={(e) =>
                  handleChange(f.name as keyof T, e.target.value)
                }
                wrapperClassName="auth-form__input-wrap"
                labelClassName="auth-form__label"
                fieldClassName="auth-form__field"
              />
              {isPassword && (
                <button
                  type="button"
                  className="auth-form__toggle"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggleShowPassword(f.name)}
                >
                  <svg
                    className="auth-form__show-icon"
                    width={16}
                    height={16}
                    aria-hidden="true"
                  >
                    <use
                      xlinkHref={`${sprite}#${showPassword[f.name] ? "eye-off-icon" : "eye-icon"}`}
                    />
                  </svg>
                </button>
              )}
            </div>
            {errors[f.name as keyof T] && (
              <span className="auth-form__error">
                {errors[f.name as keyof T]}
              </span>
            )}
          </div>
        );
      })}

      {apiError && Object.keys(errors).length === 0 && (
        <div className="auth-form__error auth-form__error--api">{apiError}</div>
      )}

      <Button
        className="btn auth-form__button"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? `${submitLabel}...` : submitLabel}
      </Button>
    </form>
  );
}

export default AuthForm;
