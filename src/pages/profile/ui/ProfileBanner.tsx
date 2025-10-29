import profileBanner from "@/assets/images/profile-banner.png";
import defaultAvatar from "@/assets/images/default_avatar.png";    
import { useUserStore } from "@/entities/user/model/user.store";   
import "./ProfileBanner.css";

function ProfileBanner() {
  const user = useUserStore((s) => s.user);
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
        <div className="profile__user-name">{user && [user.firstName, user.lastName].filter(Boolean).join(" ")}</div>
        </div>
      </div>
    </section>
  );
}

export default ProfileBanner;