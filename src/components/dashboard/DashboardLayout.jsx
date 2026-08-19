import { useRef, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ role, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);
  const touchStart = useRef(null);

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event) => {
    if (!touchStart.current || window.innerWidth >= 1024) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = Math.abs(touch.clientY - touchStart.current.y);
    const startedAtLeftEdge = touchStart.current.x <= 36;

    // Open only for a deliberate horizontal swipe from the left edge.
    // This keeps regular page scrolling and form interaction unaffected.
    if (!mobileSidebarOpen && startedAtLeftEdge && deltaX > 70 && deltaY < 70) {
      setMobileSidebarOpen(true);
    }

    touchStart.current = null;
  };

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
    <div
      className="min-h-screen overflow-x-hidden bg-[#f7f5f8]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-[#210c28]/60
            backdrop-blur-[2px]
            lg:hidden
          "
          onClick={() => setMobileSidebarOpen(false)}
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
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* PAGE CONTENT */}
        <main
          className="
            min-h-[calc(100vh-68px)]
            w-full
            min-w-0
            max-w-full
            overflow-x-hidden

            bg-[#f7f3ed]

            p-3
            sm:p-5
            md:p-6
            lg:p-7
          "
        >
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-[#e8e1e9] bg-white px-4 py-4 sm:px-5 lg:px-7">
          <div
            className="
              flex
              flex-col
              gap-1
              text-[10px]
              font-medium
              text-[#8b778e]
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
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
