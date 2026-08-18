import {
  LogOut,
  Menu,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

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

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#9b7740",
      cancelButtonColor: "#756b78",
      background: "#32143b",
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
          background: "#32143b",
          color: "#ffffff",
        }).then(() => {
          window.location.href = "/login";
        });
      }
    });
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigation = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  // ==========================================
  // LOGO CLICK
  // ==========================================

  const handleLogoClick = () => {
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

        bg-[#210c28]

        border-r
        border-white/10

        shadow-[10px_0_40px_rgba(33,12,40,0.20)]

        font-[Poppins]

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

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className={`
          flex
          h-[82px]
          shrink-0
          items-center

          border-b
          border-white/10

          ${
            collapsed
              ? "lg:justify-center lg:px-3"
              : "px-5"
          }
        `}
      >

        {/* LOGO */}

        <button
          type="button"
          onClick={handleLogoClick}
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            overflow-hidden

            rounded-full

            border
            border-white/20

            bg-white/10

            backdrop-blur-md

            shadow-[0_5px_20px_rgba(217,190,130,0.08)]

            transition-all

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
            className="h-full w-full object-cover"
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
            Smart
            <span className="font-light text-[#d9be82]">
              Society
            </span>
          </h1>

          <p className="mt-1 truncate text-[8px] font-semibold uppercase tracking-[0.2em] text-white/40">
            {config.portalLabel}
          </p>
        </div>

        {/* DESKTOP COLLAPSE */}

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

              rounded-full

              text-white/40

              transition-all

              hover:bg-white/10
              hover:text-[#d9be82]

              lg:flex
            "
            title="Collapse sidebar"
          >
            <Menu size={17} />
          </button>
        )}

        {/* MOBILE CLOSE */}

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

            rounded-full

            text-white/40

            transition-all

            hover:bg-white/10
            hover:text-[#d9be82]

            lg:hidden
          "
          title="Close sidebar"
        >
          <X size={19} />
        </button>
      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 py-7">

        {config.sections.map((section) => (
          <div
            key={section.title}
            className="mb-7"
          >

            {/* SECTION TITLE */}

            {!collapsed && (
              <div className="mb-3 flex items-center gap-2 px-3">

                <span className="h-px w-8 bg-[#9b7740]/60" />

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d9be82]/65">
                  {section.title}
                </p>

              </div>
            )}

            {/* ITEMS */}

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
                      relative
                      flex
                      h-[44px]
                      w-full
                      items-center

                      rounded-none

                      text-[12px]
                      font-semibold

                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                            bg-[#9b7740]
                            text-white
                            shadow-[0_8px_24px_rgba(155,119,64,0.20)]
                          `
                          : `
                            text-white/50
                            hover:bg-white/[0.05]
                            hover:text-white
                          `
                      }

                      ${
                        collapsed
                          ? "lg:justify-center"
                          : "gap-3 px-3"
                      }
                    `}
                  >

                    {/* ACTIVE INDICATOR */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-0
                          top-0
                          h-full
                          w-[3px]
                          bg-[#f0d9a5]
                        "
                      />
                    )}

                    {/* ICON */}

                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      className={`
                        shrink-0

                        ${
                          isActive
                            ? "text-[#f0d9a5]"
                            : "text-white/40 group-hover:text-[#d9be82]"
                        }
                      `}
                    />

                    {/* LABEL */}

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

                    {/* BADGE */}

                    {item.badge && (
                      <span
                        className={`
                          flex
                          h-5
                          min-w-5
                          items-center
                          justify-center

                          rounded-full

                          px-1.5

                          text-[9px]
                          font-bold

                          ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-[#d9be82]/10 text-[#d9be82]"
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

      {/* =================================================
          USER AREA
      ================================================= */}

      <div className="shrink-0 border-t border-white/10 p-3">

        <div
          className={`
            border
            border-white/10

            bg-[#32143b]

            ${
              collapsed
                ? "flex justify-center p-2"
                : "flex items-center gap-3 px-3 py-2.5"
            }
          `}
        >

          {/* AVATAR */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              overflow-hidden
              items-center
              justify-center

              rounded-full

              border
              border-[#d9be82]/40

              bg-[#9b7740]

              text-[10px]
              font-extrabold
              text-white
            "
          >
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

            <p className="mt-0.5 truncate text-[9px] font-medium text-white/40">
              {config.roleLabel}
            </p>
          </div>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className={`
              text-white/35

              transition-all

              hover:text-[#d9be82]

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