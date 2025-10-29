import { useState } from "react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { useUserStore } from "@/entities/user/model/user.store";
import { userApi } from "@/entities/user/model/user.api";
import type { UpdateUserPayload } from "@/entities/user/model/user.types";
import "./UserProfileForm.css";

const UserProfileForm = () => {
  const user = useUserStore((s) => s.user);

  // Начальные значения берем из стора, или пустые строки
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    avatar: user?.avatar || "",
    location: user?.location || "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    const payload: UpdateUserPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      avatar: form.avatar,
      location: form.location,
      ...(form.password ? { password: form.password } : {}),
    };

    try {
      setIsSaving(true);
      const updatedUser = await userApi.update(user.id, payload);
      useUserStore.getState().setUser(updatedUser);
      setIsSaving(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      setIsSaving(false);
      setApiError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <Input
        label="First Name"
        value={form.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
      />
      {errors.firstName && <span className="form-error">{errors.firstName}</span>}

      <Input
        label="Last Name"
        value={form.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
      />
      {errors.lastName && <span className="form-error">{errors.lastName}</span>}

      <Input
        label="Avatar URL"
        value={form.avatar}
        onChange={(e) => handleChange("avatar", e.target.value)}
      />

      <Input
        label="Location"
        value={form.location}
        onChange={(e) => handleChange("location", e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
        placeholder="Leave empty to keep current"
      />

      {apiError && <div className="form-error form-error--api">{apiError}</div>}

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default UserProfileForm;