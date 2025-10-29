import React, { useState } from "react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import "./AuthForm.css";

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
}

function AuthForm<T extends Record<string, any>>({
  fields,
  initialValues,
  onSubmit,
  submitLabel,
  isLoading,
  apiError,
}: AuthFormProps<T>) {
  const [form, setForm] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    fields.forEach((f) => {
      const value = form[f.name as keyof T];
      if (f.required && !value?.trim()) newErrors[f.name as keyof T] = `${f.label} is required`;
      else if (f.validator) {
        const err = f.validator(value);
        if (err) newErrors[f.name as keyof T] = err;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {fields.map((f) => (
        <div className="auth-form__input-container" key={f.name}>
          <Input
            label={f.label}
            type={f.type || "text"}
            placeholder={f.placeholder}
            value={form[f.name as keyof T] || ""}
            onChange={(e) => handleChange(f.name as keyof T, e.target.value)}
            wrapperClassName="auth-form__input-wrap"
            labelClassName="auth-form__label"
            fieldClassName="auth-form__field"
          />
          {errors[f.name as keyof T] && (
            <span className="auth-form__error">{errors[f.name as keyof T]}</span>
          )}
        </div>
      ))}

      {apiError && <div className="auth-form__error auth-form__error--api">{apiError}</div>}

      <Button className="btn auth-form__button" type="submit" disabled={isLoading}>
        {isLoading ? `${submitLabel}...` : submitLabel}
      </Button>
    </form>
  );
}

export default AuthForm;