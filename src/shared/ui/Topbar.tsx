import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarSearch from "./TopbarSearch";
import sprite from "@/assets/images/sprite.svg";
import defaultAvatar from "@/assets/images/default_avatar.png";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useUserStore } from "@/entities/user/model/user.store";
import ProfileDropdown from "@/entities/user/ui/ProfileDropdown";
import "./Topbar.css";

function Topbar() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const notificationsCount = useNotificationsStore(
    (state) => state.notificationsCount
  );
  const [isProfileOpen, setProfileOpen] = useState(false);

  const DEMO_CREDENTIALS = { email: "demo@fintrack.com", password: "demo123" };

  const handleDemoLogin = async () => {
    try {
      await useAuthStore.getState().login(DEMO_CREDENTIALS);
      navigate("/overview");
    } catch (err) {
      console.error("Failed to login demo user:", err);
    }
  };

  const PROFILE_OPTIONS = [
    { label: "View profile", action: () => navigate("/profile") },
    {
      label: "Change account",
      action: () => {
        logout();
        navigate("/login");
      },
    },
    { label: "Create new account", action: () => navigate("/register") },
    { label: "Login demo", action: handleDemoLogin },
    {
      label: "Log out",
      action: () => {
        logout();
        navigate("/");
      },
    },
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
                avatarUrl={user?.avatar || defaultAvatar}
                userName={`${user.firstName} ${user.lastName}`}
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
                <button className="topbar__auth-link" onClick={handleDemoLogin}>
                  <span className="topbar__auth-text">Log in as Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
