import {

  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import dashboardConfig from "../../config/dashboardConfig";

function Sidebar({
  role,
  user,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const config = dashboardConfig[role];
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: "#0f172a",
      color: "#ffffff",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        Swal.fire({
          title: "Logged Out",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          background: "#0f172a",
          color: "#ffffff",
        }).then(() => {
          window.location.href = "/";
        });
      }
    });
  };

  const handleNavigation = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogoClick = () => {
    // On desktop, clicking logo expands collapsed sidebar
    if (collapsed) {
      setCollapsed(false);
    }
  };

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        bottom-0
        z-50
        flex
        flex-col
        bg-[#0f172a]
        border-r
        border-slate-800/60
        shadow-2xl
        transition-all
        duration-300
        ease-in-out

        w-[85vw]
        max-w-[320px]

        ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0
        lg:max-w-none

        ${
          collapsed
            ? "lg:w-[76px]"
            : "lg:w-[260px]"
        }
      `}
    >
      {/* HEADER */}
      <div
        className={`
          flex
          h-[76px]
          shrink-0
          items-center
          border-b
          border-white/5

          ${
            collapsed
              ? "lg:justify-center lg:px-3"
              : "px-5"
          }
        `}
      >
        {/* LOGO - CLICK TO EXPAND WHEN COLLAPSED */}
        <button
          type="button"
          onClick={handleLogoClick}
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-emerald-500
            text-white
            shadow-lg
            shadow-emerald-500/20
            transition

            ${
              collapsed
                ? "cursor-pointer hover:scale-105"
                : "cursor-default"
            }
          `}
          title={
            collapsed
              ? "Expand sidebar"
              : "SmartSociety"
          }
        >
          <img
  src="/SmartSociety_Logo.svg"
  alt="SmartSociety Logo"
  className="h-full w-full object-contain"
/>
        </button>

        {/* BRAND */}
        <div
          className={`
            ml-3
            min-w-0

            ${
              collapsed
                ? "lg:hidden"
                : ""
            }
          `}
        >
          <h1 className="truncate text-[17px] font-extrabold leading-none tracking-tight text-white">
            SmartSociety
          </h1>

          <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.11em] text-slate-400">
            {config.portalLabel}
          </p>
        </div>

        {/* DESKTOP COLLAPSE BUTTON - HIDDEN WHEN COLLAPSED */}
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="
              ml-auto
              hidden
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-white/5
              hover:text-white
              lg:flex
            "
            title="Collapse sidebar"
          >
            <Menu size={17} />
          </button>
        )}

        {/* MOBILE CLOSE BUTTON */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="
            ml-auto
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-white/5
            hover:text-white
            lg:hidden
          "
          title="Close sidebar"
        >
          <X size={19} />
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 py-6">
        {config.sections.map((section) => (
          <div
            key={section.title}
            className="mb-5"
          >
            {!collapsed && (
              <p className="mb-2.5 px-3 text-[9px] font-bold tracking-[0.14em] text-slate-500">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  location.pathname === item.path;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      handleNavigation(item.path)
                    }
                    title={
                      collapsed
                        ? item.label
                        : undefined
                    }
                    className={`
                      group
                      flex
                      h-[43px]
                      w-full
                      items-center
                      rounded-[1px]
                      text-[12.5px]
                      font-medium
                      transition-all

                      ${
                        isActive
                          ? "bg-emerald-500 text-white shadow-[0_5px_16px_rgba(16,185,129,0.2)]"
                          : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
                      }

                      ${
                        collapsed
                          ? "lg:justify-center"
                          : "gap-3 px-3"
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className="shrink-0"
                    />

                    <span
                      className={`
                        min-w-0
                        flex-1
                        truncate
                        text-left

                        ${
                          collapsed
                            ? "lg:hidden"
                            : ""
                        }
                      `}
                    >
                      {item.label}
                    </span>

                    {item.badge && (
                      <span
                        className={`
                          flex
                          h-5
                          min-w-5
                          items-center
                          justify-center
                          rounded-[1px]
                          px-1.5
                          text-[9px]
                          font-bold

                          ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-red-500/15 text-red-400"
                          }

                          ${
                            collapsed
                              ? "lg:hidden"
                              : ""
                          }
                        `}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* USER */}
      <div className="shrink-0 border-t border-white/5 p-3">
        <div
          className={`
            rounded-[1px]
            bg-[#1d2a40]

            ${
              collapsed
                ? "flex justify-center p-2"
                : "flex items-center gap-3 px-3 py-2.5"
            }
          `}
        >
          {/* AVATAR */}
          
          <div className="flex h-9 w-9 shrink-0 overflow-hidden items-center justify-center rounded-lg bg-emerald-500 text-[10px] font-extrabold text-white">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt={user?.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name
                ? user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
                : "U"
            )}
          </div>

          {/* USER INFO */}
          <div
            className={`
              min-w-0
              flex-1

              ${
                collapsed
                  ? "lg:hidden"
                  : ""
              }
            `}
          >
            <p className="truncate text-[11px] font-bold text-white">
              {user?.name || "User"}
            </p>

            <p className="mt-0.5 truncate text-[9px] font-medium text-slate-400">
              {config.roleLabel}
            </p>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className={`
              text-slate-500
              transition
              hover:text-red-400

              ${
                collapsed
                  ? "lg:hidden"
                  : ""
              }
            `}
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
