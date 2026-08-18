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
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
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
      bg: "bg-emerald-50",
      color: "text-emerald-500",
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
      bg: "bg-amber-50",
      color: "text-amber-500",
      path: "/resident/bills",
    },
    {
      title: "Society Events",
      icon: CalendarDays,
      bg: "bg-sky-50",
      color: "text-sky-500",
      path: "/resident/events",
    },
  ];

  return (
    <DashboardLayout role="resident">
      <div className="w-full min-w-0 max-w-full">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Resident Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
              Welcome back, {resident?.name || "Resident"}
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Manage your society activities from one place.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-[1px] border border-slate-200 bg-white px-3 py-2 sm:flex">
            <Home size={15} className="text-emerald-500" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                My Flat
              </p>

              <p className="text-[11px] font-bold text-slate-800">
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
        <section className="mt-6 overflow-hidden rounded-[1px] border border-slate-200 bg-white">

          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
              <span className="text-amber-500">⚡</span>
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
                  className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[1px] border-[1.5px] border-dashed border-slate-200 bg-[#fafafa] transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.bg} ${action.color} transition group-hover:scale-110`}
                  >
                    <Icon size={20} />
                  </div>

                  <span className="text-[11.5px] font-semibold text-slate-800 group-hover:text-emerald-600">
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
          <section className="overflow-hidden rounded-[1px] border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <ShieldCheck
                  size={16}
                  className="text-emerald-500"
                />
                Recent Visitor Passes
              </h2>

              <button
                type="button"
                onClick={() => navigate("/resident/visitor-passes")}
                className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 p-5">

              {recentVisitors?.length > 0 ? (
                recentVisitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="flex items-center gap-3 rounded-[1px] border border-slate-200 bg-slate-50 p-3.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1px] bg-emerald-50 text-emerald-500">
                      <QrCode size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[11.5px] font-bold text-slate-800">
                          {visitor.visitorName}
                        </p>

                        <StatusSmall status={visitor.status} />
                      </div>

                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        {visitor.purpose}
                      </p>

                      <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
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
                className="flex w-full items-center justify-center gap-2 rounded-[1px] border border-emerald-200 bg-emerald-50 py-2.5 text-[11px] font-bold text-emerald-600 transition hover:bg-emerald-100"
              >
                <QrCode size={14} />
                Manage Visitor Passes
              </button>
            </div>
          </section>

          {/* UPCOMING EVENTS */}
          <section className="overflow-hidden rounded-[1px] border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <CalendarDays
                  size={16}
                  className="text-sky-500"
                />
                Upcoming Events
              </h2>

              <button
                type="button"
                onClick={() => navigate("/resident/events")}
                className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 p-5">

              {upcomingEvents?.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center gap-3 rounded-[1px] border border-slate-200 bg-slate-50 p-3.5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1px] bg-sky-50 text-sky-500">
                      <CalendarDays size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11.5px] font-bold text-slate-800">
                        {event.title}
                      </p>

                      <p className="mt-1 truncate text-[10px] font-medium text-slate-400">
                        {event.location || "Society"}
                      </p>

                      <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
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
                className="flex w-full items-center justify-center gap-1.5 rounded-[9px] border border-slate-200 bg-white py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
              >
                View Events
                <ArrowRight size={13} />
              </button>
            </div>
          </section>

        </div>

        {/* ================= NOTICES ================= */}
        <section className="mt-6 overflow-hidden rounded-[1px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
              <Bell
                size={16}
                className="text-emerald-500"
              />
              Recent Society Notices
            </h2>

            <button
              type="button"
              onClick={() => navigate("/resident/notices")}
              className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 p-5">

            {recentNotices?.length > 0 ? (
              recentNotices.map((notice) => (
                <div
                  key={notice._id}
                  className="flex items-start gap-3 rounded-[1px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1px] bg-emerald-50 text-emerald-500">
                    <Bell size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[11.5px] font-bold text-slate-800">
                        {notice.title}
                      </p>

                      {notice.priority && (
                        <span className="rounded-full bg-slate-200 px-2 py-1 text-[8.5px] font-bold text-slate-600">
                          {notice.priority}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-[10.5px] leading-5 text-slate-500">
                      {notice.description}
                    </p>

                    <p className="mt-2 text-[9.5px] font-semibold text-slate-400">
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
        <section className="mt-6 overflow-hidden rounded-[1px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
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
              className="group flex items-center justify-between rounded-[1px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div>
                <p className="text-[11.5px] font-bold text-slate-800">
                  View My Complaints
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  Check all submitted complaints and their status.
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-500"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/resident/complaints")}
              className="group flex items-center justify-between rounded-[1px] border border-emerald-200 bg-emerald-50 p-4 text-left transition hover:bg-emerald-100"
            >
              <div>
                <p className="text-[11.5px] font-bold text-emerald-700">
                  Create New Complaint
                </p>

                <p className="mt-1 text-[10px] text-emerald-600">
                  Report an issue to society management.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-500">
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
      icon: "bg-emerald-50 text-emerald-500",
      circle: "bg-emerald-500",
    },

    yellow: {
      icon: "bg-amber-50 text-amber-500",
      circle: "bg-amber-500",
    },

    red: {
      icon: "bg-red-50 text-red-500",
      circle: "bg-red-500",
    },
  };

  const current = tones[tone] || tones.green;

  return (
    <div className="relative overflow-hidden rounded-[1px] border border-slate-200 bg-white p-5">

      <div
        className={`absolute -right-5 -top-5 h-20 w-20 rounded-full opacity-[0.06] ${current.circle}`}
      />

      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${current.icon}`}
      >
        <Icon size={20} />
      </div>

      <div className="text-[26px] font-extrabold leading-none tracking-tight text-slate-900">
        {value}
      </div>

      <div className="mt-1 text-[12.5px] font-semibold text-slate-600">
        {title}
      </div>

      <div className="mt-1 text-[10.5px] font-medium text-slate-400">
        {label}
      </div>

    </div>
  );
}

/* ================= SMALL STATUS ================= */

function StatusSmall({ status }) {
  if (status === "Active" || status === "Approved") {
    return (
      <span className="rounded-[1px] bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600">
        {status}
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="rounded-[1px] bg-red-50 px-1.5 py-0.5 text-[8px] font-bold text-red-600">
        {status}
      </span>
    );
  }

  return (
    <span className="rounded-[1px] bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-500">
      {status || "Pending"}
    </span>
  );
}

/* ================= EMPTY STATE ================= */

function EmptyState({ text }) {
  return (
    <div className="flex min-h-[100px] items-center justify-center rounded-[1px] border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
      <p className="text-[11px] font-medium text-slate-400">
        {text}
      </p>
    </div>
  );
}

export default ResidentDashboard;