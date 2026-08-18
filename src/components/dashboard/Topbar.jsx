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

function Topbar({ role, user, setMobileSidebarOpen }) {
  const config = dashboardConfig[role];
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleNavigate = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setProfileOpen(false);

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
          navigate("/");
        });
      }
    });
  };

  return (
    <header className="sticky top-0 z-40 flex h-[68px] items-center border-b border-slate-200 bg-white px-4 sm:px-5 lg:px-7">

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        onClick={() => setMobileSidebarOpen(true)}
        className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>

      {/* PAGE TITLE */}
      <div className="min-w-0">
        <h2 className="truncate text-[15px] font-bold leading-none text-slate-900 md:text-[16px]">
          {config?.title || "Dashboard"}
        </h2>

        <p className="mt-1 hidden text-[10.5px] font-medium text-slate-400 sm:block">
          Welcome back, {user?.name || "User"} 👋
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center gap-2">

        {/* ROLE */}
        <div className="hidden h-[36px] items-center gap-1.5 rounded-[1px] border border-emerald-200 bg-emerald-50 px-3 text-[10.5px] font-bold text-emerald-600 lg:flex">
          <ShieldCheck size={14} />
          {config?.roleLabel || role}
        </div>

        {/* DATE */}
        <div className="hidden h-[36px] items-center gap-1.5 rounded-[1px] border border-slate-200 px-3 text-[10.5px] font-semibold text-slate-500 md:flex">
          <CalendarDays size={14} />
          {formattedDate}
        </div>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

        {/* SEARCH */}
        <button
          type="button"
          className="flex h-[36px] w-[36px] items-center justify-center rounded-[1px] text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          aria-label="Search"
        >
          <Search size={17} />
        </button>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          className="relative flex h-[36px] w-[36px] items-center justify-center rounded-[1px] text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell size={17} />

          <span className="absolute right-[8px] top-[7px] h-[5px] w-[5px] rounded-[1px] bg-red-500 ring-2 ring-white" />
        </button>

        <div className="mx-1 h-6 w-px bg-slate-200" />

        {/* USER PROFILE DROPDOWN */}
        <div
          ref={dropdownRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex h-[40px] items-center gap-2 rounded-[1px] px-1.5 transition hover:bg-slate-50"
          >
            {/* AVATAR */}
            
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-[1px] bg-emerald-500 text-[10px] font-extrabold text-white">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user?.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                userInitials
              )}
            </div>

            {/* USER INFORMATION */}
            <div className="hidden text-left lg:block">
              <p className="text-[10.5px] font-bold leading-none text-slate-800">
                {user?.name || "User"}
              </p>

              <p className="mt-1 text-[9px] font-medium text-slate-400">
                {config?.roleLabel || role}
              </p>
            </div>

            <ChevronDown
              size={13}
              className={`hidden text-slate-400 transition-transform duration-200 lg:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN MENU */}
          {profileOpen && (
            <div className="absolute right-0 top-[48px] z-[60] w-[210px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">

              {/* USER HEADER */}
              <div className="border-b border-slate-100 px-3 py-3">
                <p className="truncate text-[11px] font-bold text-slate-800">
                  {user?.name || "User"}
                </p>

                <p className="mt-1 truncate text-[9px] text-slate-400">
                  {user?.email || config?.roleLabel || role}
                </p>
              </div>

              {/* PROFILE */}
              <button
                type="button"
                onClick={() =>
                  handleNavigate(`/${role}/profile`)
                }
                className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[10.5px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600"
              >
                <UserCircle size={16} />
                My Profile
              </button>

              {/* SETTINGS */}
              <button
                type="button"
                onClick={() =>
                  handleNavigate(`/${role}/settings`)
                }
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[10.5px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600"
              >
                <Settings size={16} />
                Settings
              </button>

              {/* DIVIDER */}
              <div className="my-1 border-t border-slate-100" />

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[10.5px] font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
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