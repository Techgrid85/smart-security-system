import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ArrowRight,
  UserCircle,
  Loader2,
  RefreshCw,
  Home,
  CalendarDays,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH STAFF DASHBOARD
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/staff/",
        config
      );

      setComplaints(
        response.data?.data?.assignedComplaints || []
      );

      setStats(
        response.data?.data?.stats || {
          assigned: 0,
          inProgress: 0,
          resolved: 0,
        }
      );
    } catch (error) {
      console.error("Staff Dashboard Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load staff dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (complaintId, status) => {
    try {
      await axios.put(
        `https://smart-society-backend-delta.vercel.app/staff/complaints/${complaintId}/status`,
        { status },
        config
      );

      toast.success(
        `Complaint marked as ${status}`
      );

      fetchDashboardData();
    } catch (error) {
      console.error("Update Status Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint"
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // PRIORITY
  // ==========================================

  const getPriority = (complaint) => {
    if (
      complaint.category === "Security" ||
      complaint.category === "Other"
    ) {
      return "High";
    }

    if (complaint.category === "Maintenance") {
      return "Medium";
    }

    return "Normal";
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const StatusBadge = ({ status }) => {
    if (status === "Resolved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9.5px] font-bold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Resolved
        </span>
      );
    }

    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[9.5px] font-bold text-amber-600">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          In Progress
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[9.5px] font-bold text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Pending
      </span>
    );
  };

  // ==========================================
  // PRIORITY BADGE
  // ==========================================

  const PriorityBadge = ({ priority }) => {
    const styles = {
      Normal: "bg-slate-100 text-slate-500",
      Medium: "bg-amber-50 text-amber-500",
      High: "bg-orange-50 text-orange-500",
    };

    return (
      <span
        className={`rounded-full px-2 py-1 text-[9.5px] font-bold ${
          styles[priority] || styles.Normal
        }`}
      >
        {priority}
      </span>
    );
  };

  return (
    <DashboardLayout role="staff">
      <div className="w-full">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-6 flex items-end justify-between gap-4">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Maintenance Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
              Maintenance Dashboard
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Manage assigned complaints, ongoing work and maintenance tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-60"
            >
              <RefreshCw
                size={13}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

            <div className="hidden items-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3 py-2 sm:flex">

              <UserCircle
                size={15}
                className="text-emerald-500"
              />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="text-[11px] font-bold text-slate-800">
                  Society Maintenance
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* STATS */}
        {/* ========================================== */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

          <StaffStat
            title="Assigned Complaints"
            value={stats.assigned}
            label="Currently assigned to you"
            icon={ClipboardList}
            tone="green"
            change="Active work"
            changeType="neutral"
          />

          <StaffStat
            title="In Progress"
            value={stats.inProgress}
            label="Work currently underway"
            icon={Clock3}
            tone="yellow"
            change="Work underway"
            changeType="neutral"
          />

          <StaffStat
            title="Resolved Total"
            value={stats.resolved}
            label="Completed maintenance work"
            icon={CheckCircle2}
            tone="sky"
            change="Completed"
            changeType="up"
          />

          <StaffStat
            title="Pending"
            value={
              complaints.filter(
                (item) => item.status === "Pending"
              ).length
            }
            label="Waiting to be worked on"
            icon={AlertTriangle}
            tone="red"
            change="Check now"
            changeType="down"
          />

        </div>

        {/* ========================================== */}
        {/* QUICK ACTIONS */}
        {/* ========================================== */}

        <section className="mt-6 overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center border-b border-slate-200 px-5 py-4">

            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
              <span className="text-amber-500">
                ⚡
              </span>

              Quick Actions
            </h2>

          </div>

          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">

            <QuickAction
              title="Assigned Complaints"
              icon={ClipboardList}
              color="emerald"
              onClick={() =>
                (window.location.href =
                  "/staff/assigned")
              }
            />

            <QuickAction
              title="Start Work"
              icon={Wrench}
              color="indigo"
              onClick={() =>
                document
                  .getElementById("assigned-complaints")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            />

            <QuickAction
              title="Completed Work"
              icon={CheckCircle2}
              color="sky"
              onClick={() =>
                document
                  .getElementById("assigned-complaints")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            />

            <QuickAction
              title="Complaint History"
              icon={ClipboardList}
              color="amber"
              onClick={() =>
                (window.location.href =
                  "/staff/history")
              }
            />

          </div>

        </section>

        {/* ========================================== */}
        {/* COMPLAINTS */}
        {/* ========================================== */}

        <section
          id="assigned-complaints"
          className="mt-6 overflow-hidden rounded-[16px] border border-slate-200 bg-white"
        >

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">

                <ClipboardList
                  size={16}
                  className="text-emerald-500"
                />

                My Assigned Complaints

              </h2>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                Complaints assigned to you by administration
              </p>

            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-600">
              {complaints.length} Total
            </span>

          </div>

          {loading ? (

            <div className="flex items-center justify-center py-16">

              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">

                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Loading assigned complaints...

              </div>

            </div>

          ) : complaints.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <CheckCircle2 size={22} />
              </div>

              <h3 className="mt-4 text-[13px] font-bold text-slate-700">
                No complaints assigned
              </h3>

              <p className="mt-1 text-[10.5px] text-slate-400">
                You currently have no maintenance complaints assigned to you.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] border-collapse">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50">

                    <TableHead>
                      Complaint
                    </TableHead>

                    <TableHead>
                      Resident
                    </TableHead>

                    <TableHead>
                      Flat
                    </TableHead>

                    <TableHead>
                      Category
                    </TableHead>

                    <TableHead>
                      Priority
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead>
                      Action
                    </TableHead>

                  </tr>

                </thead>

                <tbody>

                  {complaints.map(
                    (complaint) => {

                      const priority =
                        getPriority(complaint);

                      return (
                        <tr
                          key={complaint._id}
                          className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50"
                        >

                          {/* COMPLAINT */}

                          <td className="px-4 py-4">

                            <p className="max-w-[220px] text-[11.5px] font-bold text-slate-700">
                              {complaint.subject}
                            </p>

                            <p className="mt-1 text-[9.5px] text-slate-400">
                              Submitted{" "}
                              {formatDate(
                                complaint.createdAt
                              )}
                            </p>

                          </td>

                          {/* RESIDENT */}

                          <td className="px-4 py-4">

                            <p className="text-[10.5px] font-semibold text-slate-600">
                              {complaint.resident?.name ||
                                "—"}
                            </p>

                            <p className="mt-1 text-[9px] text-slate-400">
                              {complaint.resident?.phone ||
                                "No phone"}
                            </p>

                          </td>

                          {/* FLAT */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">

                              <Home
                                size={13}
                                className="text-slate-400"
                              />

                              {complaint.flatNo ||
                                complaint.resident
                                  ?.flatNo ||
                                "—"}

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-4 py-4">

                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[9.5px] font-semibold text-slate-600">
                              {complaint.category}
                            </span>

                          </td>

                          {/* PRIORITY */}

                          <td className="px-4 py-4">

                            <PriorityBadge
                              priority={priority}
                            />

                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-4">

                            <StatusBadge
                              status={
                                complaint.status
                              }
                            />

                          </td>

                          {/* ACTION */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-2">

                              {complaint.status ===
                                "Pending" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      complaint._id,
                                      "In Progress"
                                    )
                                  }
                                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-amber-600"
                                >
                                  Start Work
                                </button>
                              )}

                              {complaint.status ===
                                "In Progress" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      complaint._id,
                                      "Resolved"
                                    )
                                  }
                                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-emerald-600"
                                >
                                  Mark Completed
                                </button>
                              )}

                              {complaint.status ===
                                "Resolved" && (
                                <span className="text-[9px] font-bold text-emerald-500">
                                  Completed
                                </span>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* ========================================== */}
        {/* WORK SUMMARY */}
        {/* ========================================== */}

        <div className="mt-6 grid gap-5 md:grid-cols-3">

          <SummaryCard
            icon={Wrench}
            title="Tasks Completed"
            value={stats.resolved}
            text="Maintenance tasks resolved"
            color="bg-emerald-50 text-emerald-500"
          />

          <SummaryCard
            icon={Clock3}
            title="Active Work"
            value={stats.inProgress}
            text="Tasks currently in progress"
            color="bg-sky-50 text-sky-500"
          />

          <SummaryCard
            icon={AlertTriangle}
            title="Pending Work"
            value={
              complaints.filter(
                (item) => item.status === "Pending"
              ).length
            }
            text="Tasks waiting for attention"
            color="bg-red-50 text-red-500"
          />

        </div>

        {/* ========================================== */}
        {/* MAINTENANCE NOTE */}
        {/* ========================================== */}

        <section className="mt-6 rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">

              <Wrench
                size={16}
                className="text-emerald-500"
              />

              Maintenance Workflow

            </h2>

          </div>

          <div className="p-5">

            <div className="grid gap-3 md:grid-cols-3">

              <WorkflowStep
                number="1"
                title="Assigned"
                text="Admin assigns a complaint to you."
              />

              <WorkflowStep
                number="2"
                title="Work In Progress"
                text="Start the maintenance work and update the status."
              />

              <WorkflowStep
                number="3"
                title="Completed"
                text="Mark the complaint resolved when the work is finished."
              />

            </div>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}


/* ==========================================
   QUICK ACTION
========================================== */

function QuickAction({
  title,
  icon: Icon,
  color,
  onClick,
}) {
  const styles = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-500",
      hover:
        "hover:border-emerald-400 hover:bg-emerald-50",
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-500",
      hover:
        "hover:border-indigo-400 hover:bg-indigo-50",
    },
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-500",
      hover:
        "hover:border-sky-400 hover:bg-sky-50",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-500",
      hover:
        "hover:border-amber-400 hover:bg-amber-50",
    },
  };

  const current = styles[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[13px] border-[1.5px] border-dashed border-slate-200 bg-[#fafafa] transition ${current.hover}`}
    >

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${current.bg} ${current.text} transition group-hover:scale-110`}
      >
        <Icon size={20} />
      </div>

      <span
        className={`text-center text-[11.5px] font-semibold text-slate-800 group-hover:${current.text}`}
      >
        {title}
      </span>

    </button>
  );
}


/* ==========================================
   STAT
========================================== */

function StaffStat({
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

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
            changeType === "up"
              ? "bg-emerald-50 text-emerald-500"
              : changeType === "down"
              ? "bg-red-50 text-red-500"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {changeType === "up"
            ? "↑"
            : changeType === "down"
            ? "!"
            : "•"}{" "}
          {change}
        </span>

      </div>

    </div>
  );
}


/* ==========================================
   TABLE HEAD
========================================== */

function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[9.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
      {children}
    </th>
  );
}


/* ==========================================
   SUMMARY
========================================== */

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


/* ==========================================
   WORKFLOW
========================================== */

function WorkflowStep({
  number,
  title,
  text,
}) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-[11px] font-extrabold text-white">
          {number}
        </div>

        <p className="text-[11.5px] font-bold text-slate-800">
          {title}
        </p>

      </div>

      <p className="mt-3 text-[10px] leading-5 text-slate-400">
        {text}
      </p>

    </div>
  );
}

export default StaffDashboard;