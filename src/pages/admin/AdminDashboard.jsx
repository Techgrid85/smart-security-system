
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Building2,
  ReceiptText,
  MessageSquareWarning,
  ShieldCheck,
  CalendarDays,
  UserPlus,
  FileText,
  UserCheck,
  Megaphone,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  Clock3,
  ArrowRight,
  UserCog,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

const quickActions = [
  {
    title: "Add Resident",
    icon: UserPlus,
    bg: "bg-emerald-50",
    color: "text-emerald-500",
  },
  {
    title: "Generate Bill",
    icon: FileText,
    bg: "bg-indigo-50",
    color: "text-indigo-500",
  },
  {
    title: "Manage Visitors",
    icon: UserCheck,
    bg: "bg-amber-50",
    color: "text-amber-500",
  },
  {
    title: "Create Notice",
    icon: Megaphone,
    bg: "bg-sky-50",
    color: "text-sky-500",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboardData(response.data.data);
    } catch (error) {
      console.error(
        "Dashboard Fetch Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const users = dashboardData?.users || {};
  const complaintsData = dashboardData?.complaints || {};
  const visitorsData = dashboardData?.visitors || {};

  const recentComplaints =
    dashboardData?.recentComplaints || [];

  const recentVisitors =
    dashboardData?.recentVisitors || [];

  const openComplaints =
    (complaintsData.pending || 0) +
    (complaintsData.inProgress || 0);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle
              size={32}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-3 text-base font-bold text-slate-900">
              Failed to Load Dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="mt-5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="w-full">

        {/* ================= PAGE HEADER ================= */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-extrabold text-slate-900 md:text-[22px]">
              Society Overview
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Monitor residents, staff, security and daily society activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/residents")}
            className="hidden items-center gap-2 rounded-[1px] bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white shadow-[0_4px_14px_rgba(16,185,129,0.22)] transition hover:bg-emerald-600 sm:flex"
          >
            <UserPlus size={15} />
            Add Resident
          </button>
        </div>

        {/* ================= STAT CARDS ================= */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

          <StatCard
            title="Total Residents"
            value={users.residents?.total || 0}
            label={`${users.residents?.active || 0} active residents`}
            icon={Users}
            tone="green"
            changeType="up"
            change="Registered residents"
          />

          <StatCard
            title="Maintenance Staff"
            value={users.staff?.total || 0}
            label={`${users.staff?.active || 0} active staff`}
            icon={UserCog}
            tone="sky"
            changeType="neutral"
            change="Staff members"
          />

          <StatCard
            title="Security Guards"
            value={users.guards?.total || 0}
            label={`${users.guards?.active || 0} active guards`}
            icon={ShieldCheck}
            tone="yellow"
            changeType="neutral"
            change="Security team"
          />

          <StatCard
            title="Open Complaints"
            value={openComplaints}
            label={`${complaintsData.unassigned || 0} unassigned`}
            icon={MessageSquareWarning}
            tone="red"
            changeType="down"
            change="Needs attention"
          />

        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <section className="mt-6 overflow-hidden rounded-[1px] border border-slate-200 bg-white">

          <div className="flex items-center border-b border-slate-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
              <span className="text-amber-500">⚡</span>
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-4">

            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => {
                    if (action.title === "Add Resident") {
                      navigate("/admin/residents");
                    }

                    if (action.title === "Manage Visitors") {
                      navigate("/admin/visitors");
                    }

                    if (action.title === "Generate Bill") {
                      navigate("/admin/bills");
                    }

                    if (action.title === "Create Notice") {
                      navigate("/admin/notices");
                    }
                  }}
                  className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[1px] border-[1.5px] border-dashed border-slate-200 bg-[#fafafa] px-4 text-center transition duration-200 hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.bg} ${action.color} transition duration-200 group-hover:scale-110`}
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

        {/* ================= TABLE + ACTIVITY ================= */}
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)]">

          {/* Recent Complaints */}
          <section className="overflow-hidden rounded-[1px] border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <MessageSquareWarning
                  size={16}
                  className="text-emerald-500"
                />
                Recent Complaints
              </h2>

              <a
                href="/admin/complaints"
                className="text-[11.5px] font-semibold text-emerald-500 hover:text-emerald-600"
              >
                View All →
              </a>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] border-collapse">

                <thead>
                  <tr className="bg-slate-50">

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      ID
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Issue
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Flat
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Category
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {recentComplaints.length > 0 ? (
                    recentComplaints.map((complaint) => (
                      <tr
                        key={complaint._id}
                        className="border-t border-slate-200 transition hover:bg-slate-50"
                      >

                        <td className="px-4 py-3.5 text-[12px] font-bold text-emerald-500">
                          #{complaint._id.slice(-5).toUpperCase()}
                        </td>

                        <td className="px-4 py-3.5">
                          <div>
                            <p className="text-[12px] font-semibold text-slate-800">
                              {complaint.subject}
                            </p>

                            <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                              {complaint.resident?.name ||
                                "Unknown Resident"}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-[12px] font-medium text-slate-600">
                          {complaint.flatNo ||
                            complaint.resident?.flatNo ||
                            "N/A"}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="rounded-[1px] bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                            {complaint.category}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <StatusBadge
                            status={complaint.status}
                          />
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        No complaints found
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          </section>

          {/* Gate Activity */}
          <section className="rounded-[1px] border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <ShieldCheck
                  size={16}
                  className="text-emerald-500"
                />
                Gate Activity
              </h2>

              <a
                href="/admin/security"
                className="text-[11.5px] font-semibold text-emerald-500"
              >
                View Logs →
              </a>

            </div>

            <div className="space-y-2.5 p-5">

              {recentVisitors.length > 0 ? (
                recentVisitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="flex items-center gap-3 rounded-[1px] border border-slate-200 bg-slate-50 px-3 py-3"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[1px] bg-emerald-50 text-emerald-500">
                      <ShieldCheck size={17} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-[11.5px] font-bold text-slate-800">
                        {visitor.visitorName}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
                        {visitor.isWalkIn
                          ? "Walk-in"
                          : "Visitor"}{" "}
                        · Flat {visitor.flatNo}
                      </p>

                    </div>

                    <span className="shrink-0 text-[9.5px] font-semibold text-slate-400">
                      {visitor.gateStatus}
                    </span>

                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">
                  No visitor activity found
                </p>
              )}

            </div>
          </section>

        </div>

        {/* ================= VISITOR + COMPLAINT SUMMARY ================= */}
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,1fr)]">

          {/* Complaint Summary */}
          <section className="rounded-[1px] border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <MessageSquareWarning
                  size={16}
                  className="text-emerald-500"
                />
                Complaint Overview
              </h2>

              <span className="text-[10.5px] font-medium text-slate-400">
                All Time
              </span>

            </div>

            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">

              <SummaryBox
                label="Total"
                value={complaintsData.total || 0}
              />

              <SummaryBox
                label="Pending"
                value={complaintsData.pending || 0}
              />

              <SummaryBox
                label="In Progress"
                value={complaintsData.inProgress || 0}
              />

              <SummaryBox
                label="Resolved"
                value={complaintsData.resolved || 0}
              />

              <SummaryBox
                label="Rejected"
                value={complaintsData.rejected || 0}
              />

              <SummaryBox
                label="Unassigned"
                value={complaintsData.unassigned || 0}
              />

            </div>

          </section>

          {/* Society Summary */}
          <section className="rounded-[1px] border border-slate-200 bg-white">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-[13px] font-bold text-slate-900">
                Visitor Summary
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">

              <SummaryBox
                label="Total Visitors"
                value={visitorsData.total || 0}
              />

              <SummaryBox
                label="Inside Society"
                value={visitorsData.active || 0}
              />

              <SummaryBox
                label="Completed"
                value={visitorsData.completed || 0}
              />

              <SummaryBox
                label="Walk-in Visitors"
                value={visitorsData.walkIn || 0}
              />

            </div>

          </section>

        </div>

      </div>
    </DashboardLayout>
  );
}


/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  label,
  icon: Icon,
  tone,
  change,
  changeType,
}) {
  const styles = {
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

    sky: {
      icon: "bg-sky-50 text-sky-500",
      circle: "bg-sky-500",
    },
  };

  const current = styles[tone];

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

      <div className="text-[28px] font-extrabold leading-none tracking-tight text-slate-900">
        {value}
      </div>

      <div className="mt-1 text-[12.5px] font-semibold text-slate-600">
        {title}
      </div>

      <div className="mt-1 text-[10.5px] font-medium text-slate-400">
        {label}
      </div>

      <div className="mt-3">
        <ChangeBadge
          type={changeType}
          text={change}
        />
      </div>

    </div>
  );
}


/* ================= CHANGE BADGE ================= */

function ChangeBadge({ type, text }) {
  if (type === "up") {
    return (
      <span className="inline-flex items-center gap-1 rounded-[1px] bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-500">
        <ArrowUp size={11} />
        {text}
      </span>
    );
  }

  if (type === "down") {
    return (
      <span className="inline-flex items-center gap-1 rounded-[1px] bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-500">
        <ArrowDown size={11} />
        {text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-[1px] bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
      <Minus size={11} />
      {text}
    </span>
  );
}


/* ================= STATUS ================= */

function StatusBadge({ status }) {
  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[1px] bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700">
        <span className="h-1.5 w-1.5 rounded-[1px] bg-red-500" />
        Pending
      </span>
    );
  }

  if (status === "In Progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[1px] bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
        <span className="h-1.5 w-1.5 rounded-[1px] bg-amber-500" />
        In Progress
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[1px] bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700">
        <span className="h-1.5 w-1.5 rounded-[1px] bg-red-500" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-[1px] bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-[1px] bg-emerald-500" />
      Resolved
    </span>
  );
}


/* ================= SUMMARY BOX ================= */

function SummaryBox({ label, value }) {
  return (
    <div className="rounded-[1px] border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[21px] font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;
