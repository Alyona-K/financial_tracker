import { useUserStore } from "@/entities/user/model/user.store";
import { userApi } from "@/entities/user/model/user.api";
import { EditableField } from "@/shared/ui/EditableField";
import type { User, UpdateUserPayload } from "@/entities/user/model/user.types";
import "./UserProfileForm.scss";

const UserProfileForm = () => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  if (!user) return <p>Loading user...</p>;

  const handleSave = async (field: keyof User, value: string) => {
    const payload: Partial<UpdateUserPayload> = { [field]: value };

    // если пароль — обрабатываем отдельно (только если непустой)
    if (field === "password" && !value.trim()) return;

    const updatedUser = await userApi.update(user.id, payload);
    setUser(updatedUser);
  };

  return (
    <ul className="profile-form__list">
      <li className="profile-form__item">
        <EditableField
          label="First Name"
          field="firstName"
          value={user.firstName || ""}
          onSave={handleSave}
        />
      </li>

      <li className="profile-form__item">
        <EditableField
          label="Last Name"
          field="lastName"
          value={user.lastName || ""}
          onSave={handleSave}
        />
      </li>

      <li className="profile-form__item">
        <EditableField
          label="Email"
          field="email"
          value={user.email || ""}
          onSave={handleSave}
          readOnly
        />
      </li>

      <li className="profile-form__item">
        <EditableField
          label="Location"
          field="location"
          value={user.location || ""}
          onSave={handleSave}
        />
      </li>
    </ul>
  );
};

export default UserProfileForm;
