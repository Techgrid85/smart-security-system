import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ role, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    user = null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-[1px]
            lg:hidden
          "
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        role={role}
        user={user}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* MAIN AREA */}
      <div
        className={`
          min-h-screen
          min-w-0
          transition-all
          duration-300

          ${
            sidebarCollapsed
              ? "lg:pl-[76px]"
              : "lg:pl-[260px]"
          }
        `}
      >
        {/* TOPBAR */}
        <Topbar
          role={role}
          user={user}
          setMobileSidebarOpen={
            setMobileSidebarOpen
          }
        />

        <main
          className="
    min-h-[calc(100vh-68px)]
    w-full
    min-w-0
    max-w-full
    overflow-x-hidden
    p-3
    sm:p-5
    md:p-6
    lg:p-7
  "
        >
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-5 lg:px-7">
          <div className="flex flex-col gap-1 text-[10px] font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 SmartSociety — All rights reserved.
            </p>

            <p>
              Smart Society Management Portal
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;