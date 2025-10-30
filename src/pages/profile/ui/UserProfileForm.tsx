import { useState } from "react";
import { useUserStore } from "@/entities/user/model/user.store";
import { userApi } from "@/entities/user/model/user.api";
import { EditableField } from "@/shared/ui/EditableField";
import ChangePasswordModal from "@/features/user/ui/ChangePasswordModal";
import type { User, UpdateUserPayload } from "@/entities/user/model/user.types";
import sprite from "@/assets/images/sprite.svg";
import "./UserProfileForm.css";

const UserProfileForm = () => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  if (!user) return <p>Loading user...</p>;

  const handleSave = async (field: keyof User, value: string) => {
    const payload: Partial<UpdateUserPayload> = { [field]: value };

    // если пароль — обрабатываем отдельно (только если непустой)
    if (field === "password" && !value.trim()) return;

    const updatedUser = await userApi.update(user.id, payload);
    setUser(updatedUser);
  };

  return (
    <div className="profile-form">
      <EditableField
        label="First Name"
        field="firstName"
        value={user.firstName || ""}
        onSave={handleSave}
      />

      <EditableField
        label="Last Name"
        field="lastName"
        value={user.lastName || ""}
        onSave={handleSave}
      />

      <EditableField
        label="Email"
        field="email"
        value={user.email || ""}
        onSave={handleSave}
      />

      <div className="editable-field">
        <span className="editable-field__label">Password:</span>
        <div className="editable-field__value-wrap">
          <span className="editable-field__value">••••••</span>
          <svg
            className="editable-field__edit-icon"
            onClick={() => setIsChangePasswordOpen(true)}
            width={14}
            height={13}
            aria-hidden="true"
          >
            <use xlinkHref={`${sprite}#edit-icon`} />
          </svg>
        </div>
      </div>

      <EditableField
        label="Location"
        field="location"
        value={user.location || ""}
        onSave={handleSave}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onCancel={() => setIsChangePasswordOpen(false)}
        onSave={async (_currentPassword, newPassword) => {
          if (!user) return;
          const updatedUser = await userApi.changePassword(
            user.id,
            newPassword
          );
          setUser(updatedUser); // обновляем локально
          setIsChangePasswordOpen(false);
          alert("Password updated successfully");
        }}
      />
    </div>
  );
};

export default UserProfileForm;
