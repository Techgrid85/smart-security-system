import PageLoader from "../../components/dashboard/PageLoader";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  MessageSquareWarning,
  Users,
  ReceiptText,
  Bell,
  CalendarDays,
  QrCode,
  Plus,
  ArrowRight,
  Home,
  Clock3,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ResidentDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    resident: null,

    stats: {
      totalComplaints: 0,
      pendingComplaints: 0,
      pendingMaintenance: 0,
    },

    recentNotices: [],
    upcomingEvents: [],
    recentVisitors: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login again");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://smart-society-backend-delta.vercel.app/resident",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          toast.error(
            response.data.message || "Failed to load dashboard"
          );
        }
      } catch (error) {
        console.error("Dashboard Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="resident">
        <PageLoader message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  const {
    resident,
    stats,
    recentNotices,
    upcomingEvents,
    recentVisitors,
  } = dashboardData;

  const quickActions = [
    {
      title: "Visitor Pass",
      icon: QrCode,
      bg: "bg-[#f7f3ed]",
      color: "text-[#9b7740]",
      path: "/resident/visitor-passes",
    },
    {
      title: "My Complaints",
      icon: MessageSquareWarning,
      bg: "bg-red-50",
      color: "text-red-500",
      path: "/resident/complaints",
    },
    {
      title: "Maintenance",
      icon: ReceiptText,
      bg: "bg-[#f7f3ed]",
      color: "text-[#9b7740]",
      path: "/resident/bills",
    },
    {
      title: "Society Events",
      icon: CalendarDays,
      bg: "bg-[#f7f3ed]",
      color: "text-[#9b7740]",
      path: "/resident/events",
    },
  ];

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Resident Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Welcome back, {resident?.name || "Resident"}
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Manage your society activities from one place.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-none border border-[#e2d9df] bg-white px-3 py-2 sm:flex">
            <Home size={15} className="text-[#9b7740]" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                My Flat
              </p>

              <p className="text-[11px] font-bold text-[#49394d]">
                {resident?.flatNo || "Not assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          <ResidentStat
            title="Total Complaints"
            value={stats?.totalComplaints || 0}
            label="Complaints submitted"
            icon={MessageSquareWarning}
            tone="red"
          />

          <ResidentStat
            title="Pending Complaints"
            value={stats?.pendingComplaints || 0}
            label="Awaiting resolution"
            icon={AlertCircle}
            tone="yellow"
          />

          <ResidentStat
            title="Pending Maintenance"
            value={stats?.pendingMaintenance || 0}
            label="Bills requiring attention"
            icon={ReceiptText}
            tone="green"
          />

        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <section className="mt-6 overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="border-b border-[#e2d9df] px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
              <span className="text-[#9b7740]">⚡</span>
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">

            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  type="button"
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-none border-[1.5px] border-dashed border-[#e2d9df] bg-[#f7f3ed] transition hover:border-[#bca16a] hover:bg-[#f7f3ed]"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-none ${action.bg} ${action.color} transition group-hover:scale-110`}
                  >
                    <Icon size={20} />
                  </div>

                  <span className="text-[11.5px] font-semibold text-[#49394d] group-hover:text-[#9b7740]">
                    {action.title}
                  </span>
                </button>
              );
            })}

          </div>
        </section>

        {/* ================= VISITORS + EVENTS ================= */}
        <div className="mt-6 grid gap-5 xl:grid-cols-2">

          {/* RECENT VISITORS */}
          <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

            <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                <ShieldCheck
                  size={16}
                  className="text-[#9b7740]"
                />
                Recent Visitor Passes
              </h2>

              <button
                type="button"
                onClick={() => navigate("/resident/visitor-passes")}
                className="text-[10px] font-bold text-[#9b7740] hover:text-[#9b7740]"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 p-5">

              {recentVisitors?.length > 0 ? (
                recentVisitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="flex items-center gap-3 rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-3.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                      <QrCode size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[11.5px] font-bold text-[#49394d]">
                          {visitor.visitorName}
                        </p>

                        <StatusSmall status={visitor.status} />
                      </div>

                      <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                        {visitor.purpose}
                      </p>

                      <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                        {visitor.visitDate
                          ? new Date(visitor.visitDate).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState text="No visitor passes found" />
              )}

              <button
                type="button"
                onClick={() => navigate("/resident/visitor-passes")}
                className="flex w-full items-center justify-center gap-2 rounded-none border border-[#e2d9df] bg-[#f7f3ed] py-2.5 text-[11px] font-bold text-[#9b7740] transition hover:bg-[#f5eee2]"
              >
                <QrCode size={14} />
                Manage Visitor Passes
              </button>
            </div>
          </section>

          {/* UPCOMING EVENTS */}
          <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

            <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                <CalendarDays
                  size={16}
                  className="text-[#9b7740]"
                />
                Upcoming Events
              </h2>

              <button
                type="button"
                onClick={() => navigate("/resident/events")}
                className="text-[10px] font-bold text-[#9b7740] hover:text-[#9b7740]"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 p-5">

              {upcomingEvents?.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center gap-3 rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-3.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                      <CalendarDays size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11.5px] font-bold text-[#49394d]">
                        {event.title}
                      </p>

                      <p className="mt-1 truncate text-[10px] font-medium text-[#8b778e]">
                        {event.location || "Society"}
                      </p>

                      <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState text="No upcoming events" />
              )}

              <button
                type="button"
                onClick={() => navigate("/resident/events")}
                className="flex w-full items-center justify-center gap-1.5 rounded-none border border-[#e2d9df] bg-white py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
              >
                View Events
                <ArrowRight size={13} />
              </button>
            </div>
          </section>

        </div>

        {/* ================= NOTICES ================= */}
        <section className="mt-6 overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
              <Bell
                size={16}
                className="text-[#9b7740]"
              />
              Recent Society Notices
            </h2>

            <button
              type="button"
              onClick={() => navigate("/resident/notices")}
              className="text-[10px] font-bold text-[#9b7740] hover:text-[#9b7740]"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 p-5">

            {recentNotices?.length > 0 ? (
              recentNotices.map((notice) => (
                <div
                  key={notice._id}
                  className="flex items-start gap-3 rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                    <Bell size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[11.5px] font-bold text-[#49394d]">
                        {notice.title}
                      </p>

                      {notice.priority && (
                        <span className="rounded-none bg-[#e2d9df] px-2 py-1 text-[8.5px] font-bold text-[#756b78]">
                          {notice.priority}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-[10.5px] leading-5 text-[#756b78]">
                      {notice.description}
                    </p>

                    <p className="mt-2 text-[9.5px] font-semibold text-[#8b778e]">
                      {notice.createdAt
                        ? new Date(notice.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState text="No notices available" />
            )}

          </div>
        </section>

        {/* ================= COMPLAINT SECTION ================= */}
        <section className="mt-6 overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
              <MessageSquareWarning
                size={16}
                className="text-red-500"
              />
              Complaint Management
            </h2>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2">

            <button
              type="button"
              onClick={() => navigate("/resident/complaints")}
              className="group flex items-center justify-between rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-4 text-left transition hover:border-[#d9be82] hover:bg-[#f7f3ed]"
            >
              <div>
                <p className="text-[11.5px] font-bold text-[#49394d]">
                  View My Complaints
                </p>

                <p className="mt-1 text-[10px] text-[#8b778e]">
                  Check all submitted complaints and their status.
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-[#8b778e] transition group-hover:translate-x-1 group-hover:text-[#9b7740]"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/resident/complaints")}
              className="group flex items-center justify-between rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-4 text-left transition hover:bg-[#f5eee2]"
            >
              <div>
                <p className="text-[11.5px] font-bold text-[#826331]">
                  Create New Complaint
                </p>

                <p className="mt-1 text-[10px] text-[#9b7740]">
                  Report an issue to society management.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-none bg-white text-[#9b7740]">
                <Plus size={17} />
              </div>
            </button>

          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}

/* ================= STAT CARD ================= */

function ResidentStat({
  title,
  value,
  label,
  icon: Icon,
  tone,
}) {
  const tones = {
    green: {
      icon: "bg-[#f7f3ed] text-[#9b7740]",
      circle: "bg-[#9b7740]",
    },

    yellow: {
      icon: "bg-[#f7f3ed] text-[#9b7740]",
      circle: "bg-[#9b7740]",
    },

    red: {
      icon: "bg-red-50 text-red-500",
      circle: "bg-red-500",
    },
  };

  const current = tones[tone] || tones.green;

  return (
    <div className="relative overflow-hidden rounded-none border border-[#e2d9df] bg-white p-5">

      <div
        className={`absolute -right-5 -top-5 h-20 w-20 rounded-none opacity-[0.06] ${current.circle}`}
      />

      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-none ${current.icon}`}
      >
        <Icon size={20} />
      </div>

      <div className="text-[26px] font-extrabold leading-none tracking-tight text-[#32143b]">
        {value}
      </div>

      <div className="mt-1 text-[12.5px] font-semibold text-[#756b78]">
        {title}
      </div>

      <div className="mt-1 text-[10.5px] font-medium text-[#8b778e]">
        {label}
      </div>

    </div>
  );
}

/* ================= SMALL STATUS ================= */

function StatusSmall({ status }) {
  if (status === "Active" || status === "Approved") {
    return (
      <span className="rounded-none bg-[#f7f3ed] px-1.5 py-0.5 text-[8px] font-bold text-[#9b7740]">
        {status}
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="rounded-none bg-red-50 px-1.5 py-0.5 text-[8px] font-bold text-red-600">
        {status}
      </span>
    );
  }

  return (
    <span className="rounded-none bg-[#eee8ed] px-1.5 py-0.5 text-[8px] font-bold text-[#756b78]">
      {status || "Pending"}
    </span>
  );
}

/* ================= EMPTY STATE ================= */

function EmptyState({ text }) {
  return (
    <div className="flex min-h-[100px] items-center justify-center rounded-none border border-dashed border-[#e2d9df] bg-[#f7f3ed] px-4 text-center">
      <p className="text-[11px] font-medium text-[#8b778e]">
        {text}
      </p>
    </div>
  );
}

export default ResidentDashboard;
