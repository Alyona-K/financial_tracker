import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/images/fintrack-logo.png";
import sprite from "@/assets/images/sprite.svg";
import { useNotificationsStore } from "@/shared/store/useNotificationsStore";
import "./Sidebar.scss";

function Sidebar() {
  const notificationsCount = useNotificationsStore(
    (state) => state.notificationsCount
  );

  const [openDropdown, setOpenDropdown] = useState<null | string>(null);

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <aside className="sidebar" data-testid="sidebar">
      <NavLink className="sidebar__logo" to="/" aria-label="Main page link">
        <img
          className="sidebar__logo-img"
          src={logo}
          alt="FinTrack logo"
          width={176}
          height={55}
        />
      </NavLink>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {/* --- HOME --- */}
          <li className="sidebar__item">
            <div
              className="sidebar__link"
              onClick={() => toggleDropdown("home")}
            >
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `sidebar__link-wrap ${isActive ? "sidebar__link-wrap--active" : ""}`
                }
              >
                <svg className="sidebar__link-icon" width={20} height={20}>
                  <use xlinkHref={`${sprite}#home-icon`} />
                </svg>
                <span className="sidebar__text">Home</span>
              </NavLink>

              <svg
                className={`sidebar__arrow-icon ${
                  openDropdown === "home" ? "sidebar__arrow-icon--active" : ""
                }`}
                width={24}
                height={22}
              >
                <use xlinkHref={`${sprite}#arrow-down-icon`} />
              </svg>
            </div>

            {openDropdown === "home" && (
              <ul className="sidebar__sublist">
                <li className="sidebar__subitem">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `sidebar__subitem-text ${isActive ? "sidebar__subitem-text--active" : ""}`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* --- DASHBOARD --- */}
          <li className="sidebar__item">
            <div
              className="sidebar__link"
              onClick={() => toggleDropdown("dashboard")}
            >
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `sidebar__link-wrap ${isActive ? "sidebar__link-wrap--active" : ""}`
                }
              >
                <svg className="sidebar__link-icon" width={20} height={20}>
                  <use xlinkHref={`${sprite}#dashboard-icon`} />
                </svg>
                <span className="sidebar__text">Dashboard</span>
              </NavLink>

              <svg
                className={`sidebar__arrow-icon ${
                  openDropdown === "dashboard"
                    ? "sidebar__arrow-icon--active"
                    : ""
                }`}
                width={24}
                height={22}
              >
                <use xlinkHref={`${sprite}#arrow-down-icon`} />
              </svg>
            </div>

            {openDropdown === "dashboard" && (
              <ul className="sidebar__sublist">
                <li className="sidebar__subitem">
                  <NavLink
                    to="/overview"
                    className={({ isActive }) =>
                      `sidebar__subitem-text ${isActive ? "sidebar__subitem-text--active" : ""}`
                    }
                  >
                    Overview
                  </NavLink>
                </li>
                <li className="sidebar__subitem">
                  <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                      `sidebar__subitem-text ${isActive ? "sidebar__subitem-text--active" : ""}`
                    }
                  >
                    Transactions
                  </NavLink>
                </li>
                <li className="sidebar__subitem">
                  <NavLink
                    to="/categories"
                    className={({ isActive }) =>
                      `sidebar__subitem-text ${isActive ? "sidebar__subitem-text--active" : ""}`
                    }
                  >
                    Categories
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* --- NOTIFICATIONS --- */}
          <li className="sidebar__item">
            <div className="sidebar__link">
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `sidebar__link-wrap ${isActive ? "sidebar__link-wrap--active" : ""}`
                }
              >
                <svg className="sidebar__link-icon" width={20} height={20}>
                  <use xlinkHref={`${sprite}#notifications-icon`} />
                </svg>
                <span className="sidebar__text">Notifications</span>
              </NavLink>
              {notificationsCount > 0 && (
                <span className="sidebar__notifications-number">
                  {notificationsCount}
                </span>
              )}
            </div>
          </li>

          {/* --- CONSULTATION --- */}
          <li className="sidebar__item">
            <div className="sidebar__link">
              <NavLink
                to="/consultation"
                className={({ isActive }) =>
                  `sidebar__link-wrap ${isActive ? "sidebar__link-wrap--active" : ""}`
                }
              >
                <svg className="sidebar__link-icon" width={20} height={20}>
                  <use xlinkHref={`${sprite}#consultation-icon`} />
                </svg>
                <span className="sidebar__text">Consultation</span>
              </NavLink>
            </div>
          </li>

          {/* --- REPORT --- */}
          <li className="sidebar__item">
            <div className="sidebar__link">
              <NavLink
                to="/report"
                className={({ isActive }) =>
                  `sidebar__link-wrap ${isActive ? "sidebar__link-wrap--active" : ""}`
                }
              >
                <svg className="sidebar__link-icon" width={20} height={20}>
                  <use xlinkHref={`${sprite}#reporting-icon`} />
                </svg>
                <span className="sidebar__text">Report</span>
              </NavLink>
            </div>
          </li>

          {/* --- SUPPORT --- */}
          <li className="sidebar__item">
            <div className="sidebar__link">
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  `sidebar__link-wrap ${isActive ? "sidebar__link-wrap--active" : ""}`
                }
              >
                <svg className="sidebar__link-icon" width={20} height={20}>
                  <use xlinkHref={`${sprite}#support-icon`} />
                </svg>
                <span className="sidebar__text">Support</span>
              </NavLink>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
