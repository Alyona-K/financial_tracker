import { useState, useRef } from "react";
import profileBanner from "@/assets/images/profile-banner.png";
import defaultAvatar from "@/assets/images/default_avatar.png";
import { useUserStore } from "@/entities/user/model/user.store";
import sprite from "@/assets/images/sprite.svg";
import "./ProfileBanner.css";

function ProfileBanner() {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Создаём локальный URL для превью
    const reader = new FileReader();
    reader.onloadend = async () => {
      const avatarUrl = reader.result as string;

      // Обновляем стор и через апи
      await updateUser({ avatar: avatarUrl });
    };
    reader.readAsDataURL(file);
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
        </div>
      </div>
    </section>
  );
}

export default ProfileBanner;
