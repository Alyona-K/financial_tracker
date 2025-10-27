import { useState } from "react";
import TopbarSearch from "./TopbarSearch";
import sprite from "@/assets/images/sprite.svg";
import defaultAvatar from "@/assets/images/avatar.png";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import ProfileDropdown from "@/entities/user/ui/ProfileDropdown";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

function Topbar() {
  const notificationsCount = useNotificationsStore(
    (state) => state.notificationsCount
  );

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const navigate = useNavigate();

  const [isProfileOpen, setProfileOpen] = useState(false);

  const PROFILE_OPTIONS = [
    { label: "View profile", action: () => navigate("/profile") },
    { label: "Change account", action: () => navigate("/account/change") },
    { label: "Log out", action: logout },
  ];

  return (
    <header className="header">
      <div className="topbar">
        <TopbarSearch />

        <div className="topbar__users">
          <div className="topbar__icons">
            <a className="topbar__link" href="#" aria-hidden="true">
              <svg className="topbar__icon" width={22} height={22}>
                <use xlinkHref={`${sprite}#settings-icon`} />
              </svg>
            </a>

            <a className="topbar__link" href="#" aria-hidden="true">
              <svg className="topbar__icon" width={22} height={22}>
                <use xlinkHref={`${sprite}#notifications-icon`} />
              </svg>
              {notificationsCount > 0 && (
                <span className="topbar__count">{notificationsCount}</span>
              )}
            </a>
          </div>

          <div className="topbar__account">
            {user ? (
              <ProfileDropdown
                avatarUrl={user.avatar || defaultAvatar}
                userName={user.name}
                options={PROFILE_OPTIONS}
                isOpen={isProfileOpen}
                onToggle={() => setProfileOpen(true)}
                onClose={() => setProfileOpen(false)}
              />
            ) : (
              <div className="topbar__auth">
                <a href="/login" className="topbar__auth-link">
                  <span className="topbar__auth-text">Log in</span>
                </a>
                <a href="/register" className="topbar__auth-link">
                  <span className="topbar__auth-text">Register</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
