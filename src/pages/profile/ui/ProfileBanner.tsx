import { useState, useRef } from "react";
import profileBanner from "@/assets/images/profile-banner.png";
import defaultAvatar from "@/assets/images/default_avatar.png";
import { useUserStore } from "@/entities/user/model/user.store";
import sprite from "@/assets/images/sprite.svg";
import "./ProfileBanner.scss";

function ProfileBanner() {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- AVATAR UPLOAD HANDLERS ---
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);

      // --- UPLOAD AVATAR TO CLOUDINARY ---
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_upload"); // твой пресет
      formData.append("folder", "fintrack/avatars");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dlz6x4ygk/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Upload failed");

      const avatarUrl = data.secure_url;

      // --- SAVE AVATAR URL TO STORE AND DB ---
      await updateUser({ avatar: avatarUrl });
    } catch (err) {
      console.error("Ошибка загрузки аватара:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="profile__banner">
      <div className="profile__banner-wrap">
        <img
          className="profile__banner-img"
          src={profileBanner}
          alt="Profile banner"
          width={1584}
          height={396}
        />
        <div className="profile__user">
          <img
            className="profile__avatar"
            src={user?.avatar || defaultAvatar}
            alt="Profile avatar"
            width={200}
            height={200}
          />
          <button
            className="profile__edit-btn"
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploading}
          >
            <svg
              className="profile__edit-icon"
              width={14}
              height={13}
              aria-hidden="true"
            >
              <use xlinkHref={`${sprite}#edit-icon`} />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="profile__user-name">
            {user && [user.firstName, user.lastName].filter(Boolean).join(" ")}
          </div>
          {isUploading && (
            <div className="profile__uploading">Uploading...</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileBanner;
