import { useEffect, useState } from "react";
import axios from "axios";

import {
  ShieldCheck,
  Users,
  LogIn,
  LogOut,
  AlertTriangle,
  QrCode,
  UserPlus,
  Search,
  ClipboardList,
  ArrowRight,
  Loader2,
  Calendar,
  Clock3,
  Home,
  Phone,
} from "lucide-react";

import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";



const quickActions = [
  {
    title: "Verify Gate Pass",
    icon: QrCode,
    bg: "bg-emerald-50",
    color: "text-emerald-500",
    path: "/guard/verify-pass",
  },
  {
    title: "Walk-in Visitor",
    icon: UserPlus,
    bg: "bg-indigo-50",
    color: "text-indigo-500",
    path: "/guard/walk-in",
  },
  {
    title: "Search Visitor",
    icon: Search,
    bg: "bg-sky-50",
    color: "text-sky-500",
    path: "/guard/all-visitors",
  },
  {
    title: "Gate Logs",
    icon: ClipboardList,
    bg: "bg-amber-50",
    color: "text-amber-500",
    path: "/guard/entry-logs",
  },
];

function GuardDashboard() {
  const [approvedVisitors, setApprovedVisitors] = useState([]);
  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [entryLogs, setEntryLogs] = useState([]);
  const [exitLogs, setExitLogs] = useState([]);
  const [overstayAlerts, setOverstayAlerts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // LOAD ALL DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        approvedResponse,
        activeResponse,
        pendingResponse,
        entryResponse,
        exitResponse,
        overstayResponse,
      ] = await Promise.all([
        axios.get(
          "https://smart-society-backend-delta.vercel.app/guard/visitor-passes",
          config
        ),
        axios.get(
          "https://smart-society-backend-delta.vercel.app/guard/active-visitors",
          config
        ),
        axios.get(
          "https://smart-society-backend-delta.vercel.app/guard/pending-visitors",
          config
        ),
        axios.get(
          "https://smart-society-backend-delta.vercel.app/guard/entry-logs",
          config
        ),
        axios.get(
          "https://smart-society-backend-delta.vercel.app/guard/exit-logs",
          config
        ),
        axios.get(
          "https://smart-society-backend-delta.vercel.app/guard/overstay-alerts",
          config
        ),
      ]);

      setApprovedVisitors(
        approvedResponse.data.data || []
      );

      setPendingVisitors(
        pendingResponse.data.data || []
      );

      setActiveVisitors(
        activeResponse.data.data || []
      );

      setEntryLogs(
        entryResponse.data.data || []
      );

      setExitLogs(
        exitResponse.data.data || []
      );

      setOverstayAlerts(
        overstayResponse.data.data || []
      );
    } catch (error) {
      console.error(
        "Guard Dashboard Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  
  const today = new Date().toDateString();

  const todayEntries = entryLogs.filter(
    (visitor) =>
      visitor.entryTime &&
      new Date(visitor.entryTime).toDateString() ===
        today
  );

  const todayExits = exitLogs.filter(
    (visitor) =>
      visitor.exitTime &&
      new Date(visitor.exitTime).toDateString() ===
        today
  );

 
  const recentVisitors = [
    ...activeVisitors,
    ...exitLogs,
    ...approvedVisitors,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.entryTime ||
            b.exitTime ||
            b.createdAt
        ) -
        new Date(
          a.entryTime ||
            a.exitTime ||
            a.createdAt
        )
    )
    .filter(
      (visitor, index, self) =>
        index ===
        self.findIndex(
          (item) => item._id === visitor._id
        )
    )
    .slice(0, 6);

  
  if (loading) {
    return (
      <DashboardLayout role="guard">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={32}
              className="animate-spin text-emerald-500"
            />

            <p className="text-sm font-medium text-slate-400">
              Loading security dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="guard">
      <div className="w-full">

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Security Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
              Gate Management
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Monitor visitor passes and manage society gate activity.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-[10px] border border-emerald-200 bg-emerald-50 px-3 py-2 sm:flex">
            <ShieldCheck
              size={15}
              className="text-emerald-500"
            />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-500">
                Gate Status
              </p>

              <p className="text-[11px] font-bold text-emerald-700">
                Gate 1 · Active
              </p>
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-[11px] font-semibold text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

          <GuardStat
            title="Visitors Today"
            value={todayEntries.length}
            label="Total gate entries today"
            icon={Users}
            tone="green"
            change="Today's entries"
            changeType="up"
          />

          <GuardStat
            title="Currently Inside"
            value={activeVisitors.length}
            label="Visitors currently in society"
            icon={LogIn}
            tone="sky"
            change="Live count"
            changeType="neutral"
          />

          <GuardStat
            title="Today's Exits"
            value={todayExits.length}
            label="Visitors checked out today"
            icon={LogOut}
            tone="yellow"
            change="Today's activity"
            changeType="neutral"
          />

          <GuardStat
            title="Waiting at Gate"
            value={approvedVisitors.length}
            label="Approved passes awaiting entry"
            icon={QrCode}
            tone="red"
            change={
              approvedVisitors.length > 0
                ? "Verification needed"
                : "No pending visitors"
            }
            changeType={
              approvedVisitors.length > 0
                ? "down"
                : "neutral"
            }
          />

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="mt-6 overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center border-b border-slate-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
              <span className="text-amber-500">
                ⚡
              </span>

              Gate Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">

            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  to={action.path}
                  key={action.title}
                  className="group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[13px] border-[1.5px] border-dashed border-slate-200 bg-[#fafafa] transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.bg} ${action.color} transition group-hover:scale-110`}
                  >
                    <Icon size={20} />
                  </div>

                  <span className="text-center text-[11.5px] font-semibold text-slate-800 group-hover:text-emerald-600">
                    {action.title}
                  </span>
                </Link>
              );
            })}

          </div>
        </section>

        {/* ================= APPROVED VISITOR PASSES ================= */}

        <section className="mt-6 overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <QrCode
                  size={16}
                  className="text-emerald-500"
                />
                Pending Visitor Passes
              </h2>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                Visitor passes created by residents and waiting for guard approval.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[9.5px] font-bold text-emerald-600">
              {pendingVisitors.length} Pending
            </span>

          </div>

          {pendingVisitors.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="bg-slate-50">
                    <TableHead>Visitor</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </thead>

                <tbody>

                  {pendingVisitors.map((visitor) => (
                    <tr
                      key={visitor._id}
                      className="border-t border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-[11.5px] font-bold text-slate-800">
                          {visitor.visitorName}
                        </p>

                        <p className="mt-1 text-[9.5px] text-slate-400">
                          ID: {visitor._id}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 text-[11px] font-semibold text-slate-600">
                        {visitor.flatNo || "-"}
                      </td>

                      <td className="px-4 py-3.5 text-[11px] text-slate-500">
                        {visitor.phone || "-"}
                      </td>

                      <td className="px-4 py-3.5 text-[10.5px] text-slate-500">
                        {visitor.visitDate
                          ? new Date(
                              visitor.visitDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3.5 text-[10.5px] text-slate-500">
                        {visitor.purpose || "-"}
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await axios.put(
                                `https://smart-society-backend-delta.vercel.app/guard/approve-pass/${visitor._id}`,
                                {},
                                config
                              );

                              await fetchDashboardData();
                            } catch (error) {
                              console.error("Approve Visitor Error:", error);

                              setError(
                                error.response?.data?.message ||
                                "Failed to approve visitor"
                              );
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-[9.5px] font-bold text-white transition hover:bg-emerald-600"
                        >
                          <ShieldCheck size={13} />
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="flex min-h-[160px] flex-col items-center justify-center text-center">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <QrCode size={20} />
              </div>

              <p className="mt-3 text-[11px] font-bold text-slate-700">
                No visitor passes waiting
              </p>

              <p className="mt-1 text-[9.5px] text-slate-400">
                New passes created by residents will appear here.
              </p>

            </div>
          )}

        </section>

        {/* ================= LIVE GATE ACTIVITY ================= */}

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_0.95fr]">

          <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <ShieldCheck
                  size={16}
                  className="text-emerald-500"
                />
                Recent Gate Activity
              </h2>

              <Link
                to="/guard/entry-logs"
                className="text-[11.5px] font-semibold text-emerald-500"
              >
                View All →
              </Link>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[600px]">

                <thead>
                  <tr className="bg-slate-50">
                    <TableHead>Visitor</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Status</TableHead>
                  </tr>
                </thead>

                <tbody>

                  {recentVisitors.length > 0 ? (
                    recentVisitors.map((visitor) => (
                      <tr
                        key={visitor._id}
                        className="border-t border-slate-200 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                              <Users size={14} />
                            </div>

                            <span className="text-[11.5px] font-bold text-slate-800">
                              {visitor.visitorName}
                            </span>

                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-[11px] font-semibold text-slate-600">
                          {visitor.flatNo || "-"}
                        </td>

                        <td className="px-4 py-3.5 text-[10.5px] text-slate-500">
                          {visitor.phone || "-"}
                        </td>

                        <td className="px-4 py-3.5 text-[10.5px] text-slate-400">
                          {visitor.entryTime
                            ? new Date(
                                visitor.entryTime
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "Waiting"}
                        </td>

                        <td className="px-4 py-3.5">
                          <VisitorStatus
                            status={visitor.gateStatus}
                          />
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-10 text-center text-[11px] font-medium text-slate-400"
                      >
                        No visitor activity found
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* ================= ACTIVE VISITORS ================= */}

          <section className="rounded-[16px] border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <Users
                  size={16}
                  className="text-sky-500"
                />
                Currently Inside
              </h2>

              <span className="rounded-full bg-sky-50 px-2 py-1 text-[9.5px] font-bold text-sky-600">
                {activeVisitors.length}
              </span>

            </div>

            <div className="space-y-2.5 p-5">

              {activeVisitors.length > 0 ? (
                activeVisitors.slice(0, 5).map(
                  (visitor) => (
                    <div
                      key={visitor._id}
                      className="rounded-[12px] border border-slate-100 p-3"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                          <Users size={16} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-[11px] font-bold text-slate-800">
                            {visitor.visitorName}
                          </p>

                          <p className="mt-0.5 text-[9.5px] text-slate-400">
                            Flat {visitor.flatNo || "-"} ·{" "}
                            {visitor.purpose || "Visitor"}
                          </p>

                        </div>

                      </div>

                      <div className="mt-3 flex items-center justify-between">

                        <span className="text-[9px] text-slate-400">
                          Entered{" "}
                          {visitor.entryTime
                            ? new Date(
                                visitor.entryTime
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </span>

                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8.5px] font-bold text-emerald-600">
                          Inside
                        </span>

                      </div>

                    </div>
                  )
                )
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center text-center">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <ShieldCheck size={20} />
                  </div>

                  <p className="mt-3 text-[11px] font-bold text-slate-700">
                    No visitors inside
                  </p>

                  <p className="mt-1 text-[9.5px] text-slate-400">
                    The society is clear right now.
                  </p>

                </div>
              )}

            </div>

          </section>

        </div>

        {/* ================= SECURITY SUMMARY ================= */}

        <div className="mt-6 grid gap-5 md:grid-cols-3">

          <SummaryCard
            icon={LogIn}
            title="Today's Entries"
            value={todayEntries.length}
            text="Visitors checked in today"
            color="bg-emerald-50 text-emerald-500"
          />

          <SummaryCard
            icon={LogOut}
            title="Today's Exits"
            value={todayExits.length}
            text="Visitors checked out today"
            color="bg-sky-50 text-sky-500"
          />

          <SummaryCard
            icon={AlertTriangle}
            title="Overstay Alerts"
            value={overstayAlerts.length}
            text="Visitors requiring review"
            color="bg-red-50 text-red-500"
          />

        </div>

      </div>
    </DashboardLayout>
  );
}


/* ================= STAT CARD ================= */

function GuardStat({
  title,
  value,
  label,
  icon: Icon,
  tone,
  change,
  changeType,
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
    sky: {
      icon: "bg-sky-50 text-sky-500",
      circle: "bg-sky-500",
    },
  };

  const current = tones[tone];

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-slate-200 bg-white p-5">

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
      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-500">
        ↑ {text}
      </span>
    );
  }

  if (type === "down") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-500">
        ! {text}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
      • {text}
    </span>
  );
}


function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[9.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
      {children}
    </th>
  );
}


function VisitorStatus({ status }) {
  if (status === "Inside") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9.5px] font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Inside
      </span>
    );
  }

  if (status === "Exited") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[9.5px] font-bold text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        Exited
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[9.5px] font-bold text-amber-600">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Waiting
    </span>
  );
}


function SummaryCard({
  icon: Icon,
  title,
  value,
  text,
  color,
}) {
  return (
    <div className="rounded-[16px] border border-slate-200 bg-white p-5">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={18} />
        </div>

        <ArrowRight
          size={15}
          className="text-slate-300"
        />

      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-[25px] font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-medium text-slate-400">
        {text}
      </p>

    </div>
  );
}

export default GuardDashboard;