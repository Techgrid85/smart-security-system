import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Search,
  Bell,
  CalendarDays,
  ChevronDown,
  ShieldCheck,
  Menu,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

import dashboardConfig from "../../config/dashboardConfig";

function Topbar({
  role,
  user,
  setMobileSidebarOpen,
}) {
  const config = dashboardConfig[role];
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const dropdownRef = useRef(null);

  const formattedDate =
    new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // =====================================================
  // CLOSE DROPDOWN
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigate = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setProfileOpen(false);

    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#9b7740",
      cancelButtonColor: "#63366f",

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

          iconColor: "#d9be82",
        }).then(() => {
          navigate("/login");
        });
      }
    });
  };

  return (
    <header
      className="
        sticky
        top-0
        z-40

        flex
        h-[68px]
        items-center

        border-b
        border-[#e2d9df]

        bg-white/95
        backdrop-blur-xl

        px-4
        sm:px-5
        lg:px-7
      "
    >

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          setMobileSidebarOpen(true)
        }
        className="
          mr-3
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center

          rounded-lg

          text-[#63366f]

          transition

          hover:bg-[#f7f3ed]
          hover:text-[#9b7740]

          lg:hidden
        "
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <div className="min-w-0">

        <h2
          className="
            truncate
            text-[15px]
            font-bold
            leading-none
            text-[#32143b]

            md:text-[16px]
          "
        >
          {config?.title || "Dashboard"}
        </h2>

        <p
          className="
            mt-1
            hidden
            text-[10.5px]
            font-medium
            text-[#8b778e]

            sm:block
          "
        >
          Welcome back, {user?.name || "User"} 👋
        </p>

      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="ml-auto flex items-center gap-2">

        {/* =================================================
            ROLE
        ================================================= */}

        <div
          className="
            hidden
            h-[36px]
            items-center
            gap-1.5

            rounded-lg

            border
            border-[#d9be82]/40

            bg-[#f7f3ed]

            px-3

            text-[10.5px]
            font-bold
            text-[#9b7740]

            lg:flex
          "
        >
          <ShieldCheck size={14} />

          {config?.roleLabel || role}
        </div>

        {/* =================================================
            DATE
        ================================================= */}

        <div
          className="
            hidden
            h-[36px]
            items-center
            gap-1.5

            rounded-lg

            border
            border-[#e2d9df]

            bg-white

            px-3

            text-[10.5px]
            font-semibold
            text-[#756b78]

            md:flex
          "
        >
          <CalendarDays
            size={14}
            className="text-[#9b7740]"
          />

          {formattedDate}
        </div>

        <div
          className="
            mx-1
            hidden
            h-6
            w-px
            bg-[#e2d9df]

            sm:block
          "
        />

        {/* =================================================
            SEARCH
        ================================================= */}

        <button
          type="button"
          className="
            flex
            h-[36px]
            w-[36px]
            items-center
            justify-center

            rounded-lg

            text-[#756b78]

            transition

            hover:bg-[#f7f3ed]
            hover:text-[#9b7740]
          "
          aria-label="Search"
        >
          <Search size={17} />
        </button>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <button
          type="button"
          className="
            relative
            flex
            h-[36px]
            w-[36px]
            items-center
            justify-center

            rounded-lg

            text-[#756b78]

            transition

            hover:bg-[#f7f3ed]
            hover:text-[#9b7740]
          "
          aria-label="Notifications"
        >
          <Bell size={17} />

          <span
            className="
              absolute
              right-[8px]
              top-[7px]

              h-[5px]
              w-[5px]

              rounded-full

              bg-[#9b7740]

              ring-2
              ring-white
            "
          />
        </button>

        <div
          className="
            mx-1
            h-6
            w-px
            bg-[#e2d9df]
          "
        />

        {/* =================================================
            USER PROFILE
        ================================================= */}

        <div
          ref={dropdownRef}
          className="relative"
        >

          <button
            type="button"
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            className="
              flex
              h-[40px]
              items-center
              gap-2

              rounded-lg

              px-1.5

              transition

              hover:bg-[#f7f3ed]
            "
          >

            {/* AVATAR */}

            <div
              className="
                flex
                h-[34px]
                w-[34px]
                shrink-0

                items-center
                justify-center

                overflow-hidden

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
                  alt={
                    user?.name || "User"
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />
              ) : (
                userInitials
              )}
            </div>

            {/* USER INFORMATION */}

            <div className="hidden text-left lg:block">

              <p
                className="
                  text-[10.5px]
                  font-bold
                  leading-none
                  text-[#32143b]
                "
              >
                {user?.name || "User"}
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  text-[#8b778e]
                "
              >
                {config?.roleLabel || role}
              </p>

            </div>

            <ChevronDown
              size={13}
              className={`
                hidden
                text-[#8b778e]
                transition-transform
                duration-200

                lg:block

                ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>

          {/* =================================================
              DROPDOWN
          ================================================= */}

          {profileOpen && (
            <div
              className="
                absolute
                right-0
                top-[48px]
                z-[60]

                w-[220px]

                overflow-hidden

                rounded-xl

                border
                border-[#e2d9df]

                bg-white

                p-1.5

                shadow-[0_15px_40px_rgba(50,20,59,0.12)]
              "
            >

              {/* USER HEADER */}

              <div
                className="
                  border-b
                  border-[#eee8ed]

                  px-3
                  py-3
                "
              >
                <p
                  className="
                    truncate
                    text-[11px]
                    font-bold
                    text-[#32143b]
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    text-[9px]
                    text-[#8b778e]
                  "
                >
                  {user?.email ||
                    config?.roleLabel ||
                    role}
                </p>
              </div>

              {/* PROFILE */}

              <button
                type="button"
                onClick={() =>
                  handleNavigate(
                    `/${role}/profile`
                  )
                }
                className="
                  mt-1
                  flex
                  w-full
                  items-center
                  gap-2.5

                  rounded-lg

                  px-3
                  py-2.5

                  text-left
                  text-[10.5px]
                  font-semibold

                  text-[#756b78]

                  transition

                  hover:bg-[#f7f3ed]
                  hover:text-[#9b7740]
                "
              >
                <UserCircle size={16} />

                My Profile
              </button>

              {/* SETTINGS */}

              <button
                type="button"
                onClick={() =>
                  handleNavigate(
                    `/${role}/settings`
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-2.5

                  rounded-lg

                  px-3
                  py-2.5

                  text-left
                  text-[10.5px]
                  font-semibold

                  text-[#756b78]

                  transition

                  hover:bg-[#f7f3ed]
                  hover:text-[#9b7740]
                "
              >
                <Settings size={16} />

                Settings
              </button>

              {/* DIVIDER */}

              <div
                className="
                  my-1
                  border-t
                  border-[#eee8ed]
                "
              />

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  w-full
                  items-center
                  gap-2.5

                  rounded-lg

                  px-3
                  py-2.5

                  text-left
                  text-[10.5px]
                  font-semibold

                  text-red-500

                  transition

                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <LogOut size={16} />

                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Topbar;