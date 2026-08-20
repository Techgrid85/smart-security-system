import PageLoader from "../../components/dashboard/PageLoader";
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
        <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9.5px] font-bold text-[#9b7740]">
          <span className="h-1.5 w-1.5 rounded-none bg-[#9b7740]" />
          Resolved
        </span>
      );
    }

    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9.5px] font-bold text-[#9b7740]">
          <span className="h-1.5 w-1.5 rounded-none bg-[#9b7740]" />
          In Progress
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-red-50 px-2.5 py-1 text-[9.5px] font-bold text-red-600">
        <span className="h-1.5 w-1.5 rounded-none bg-red-500" />
        Pending
      </span>
    );
  };

  // ==========================================
  // PRIORITY BADGE
  // ==========================================

  const PriorityBadge = ({ priority }) => {
    const styles = {
      Normal: "bg-[#eee8ed] text-[#756b78]",
      Medium: "bg-[#f7f3ed] text-[#9b7740]",
      High: "bg-[#f7f3ed] text-[#9b7740]",
    };

    return (
      <span
        className={`rounded-none px-2 py-1 text-[9.5px] font-bold ${
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
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Maintenance Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Maintenance Dashboard
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Manage assigned complaints, ongoing work and maintenance tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-none border border-[#e2d9df] bg-white px-3 text-[10px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740] disabled:opacity-60"
            >
              <RefreshCw
                size={13}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

            <div className="hidden items-center gap-2 rounded-none border border-[#e2d9df] bg-white px-3 py-2 sm:flex">

              <UserCircle
                size={15}
                className="text-[#9b7740]"
              />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Department
                </p>

                <p className="text-[11px] font-bold text-[#49394d]">
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

        <section className="mt-6 overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center border-b border-[#e2d9df] px-5 py-4">

            <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
              <span className="text-[#9b7740]">
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
          className="mt-6 overflow-hidden rounded-none border border-[#e2d9df] bg-white"
        >

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">

                <ClipboardList
                  size={16}
                  className="text-[#9b7740]"
                />

                My Assigned Complaints

              </h2>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                Complaints assigned to you by administration
              </p>

            </div>

            <span className="rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9px] font-bold text-[#9b7740]">
              {complaints.length} Total
            </span>

          </div>

          {loading ? (
            <PageLoader message="Loading assigned complaints..." />
          ) : complaints.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                <CheckCircle2 size={22} />
              </div>

              <h3 className="mt-4 text-[13px] font-bold text-[#49394d]">
                No complaints assigned
              </h3>

              <p className="mt-1 text-[10.5px] text-[#8b778e]">
                You currently have no maintenance complaints assigned to you.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] border-collapse">

                <thead>

                  <tr className="border-b border-[#eee8ed] bg-[#f7f3ed]">

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
                          className="border-b border-[#eee8ed] last:border-0 transition hover:bg-[#f7f3ed]"
                        >

                          {/* COMPLAINT */}

                          <td className="px-4 py-4">

                            <p className="max-w-[220px] text-[11.5px] font-bold text-[#49394d]">
                              {complaint.subject}
                            </p>

                            <p className="mt-1 text-[9.5px] text-[#8b778e]">
                              Submitted{" "}
                              {formatDate(
                                complaint.createdAt
                              )}
                            </p>

                          </td>

                          {/* RESIDENT */}

                          <td className="px-4 py-4">

                            <p className="text-[10.5px] font-semibold text-[#756b78]">
                              {complaint.resident?.name ||
                                "—"}
                            </p>

                            <p className="mt-1 text-[9px] text-[#8b778e]">
                              {complaint.resident?.phone ||
                                "No phone"}
                            </p>

                          </td>

                          {/* FLAT */}

                          <td className="px-4 py-4">

                            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#756b78]">

                              <Home
                                size={13}
                                className="text-[#8b778e]"
                              />

                              {complaint.flatNo ||
                                complaint.resident
                                  ?.flatNo ||
                                "—"}

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-4 py-4">

                            <span className="rounded-none bg-[#eee8ed] px-2.5 py-1 text-[9.5px] font-semibold text-[#756b78]">
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
                                  className="rounded-none bg-[#9b7740] px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-[#9b7740]"
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
                                  className="rounded-none bg-[#9b7740] px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-[#9b7740]"
                                >
                                  Mark Completed
                                </button>
                              )}

                              {complaint.status ===
                                "Resolved" && (
                                <span className="text-[9px] font-bold text-[#9b7740]">
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
            color="bg-[#f7f3ed] text-[#9b7740]"
          />

          <SummaryCard
            icon={Clock3}
            title="Active Work"
            value={stats.inProgress}
            text="Tasks currently in progress"
            color="bg-[#f7f3ed] text-[#9b7740]"
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

        <section className="mt-6 rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">

              <Wrench
                size={16}
                className="text-[#9b7740]"
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
      bg: "bg-[#f7f3ed]",
      text: "text-[#9b7740]",
      hover:
        "hover:border-[#bca16a] hover:bg-[#f7f3ed]",
    },
    indigo: {
      bg: "bg-[#f7f3ed]",
      text: "text-[#63366f]",
      hover:
        "hover:border-[#806d82] hover:bg-[#f7f3ed]",
    },
    sky: {
      bg: "bg-[#f7f3ed]",
      text: "text-[#9b7740]",
      hover:
        "hover:border-[#bca16a] hover:bg-[#f7f3ed]",
    },
    amber: {
      bg: "bg-[#f7f3ed]",
      text: "text-[#9b7740]",
      hover:
        "hover:border-[#bca16a] hover:bg-[#f7f3ed]",
    },
  };

  const current = styles[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-none border-[1.5px] border-dashed border-[#e2d9df] bg-[#f7f3ed] transition ${current.hover}`}
    >

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-none ${current.bg} ${current.text} transition group-hover:scale-110`}
      >
        <Icon size={20} />
      </div>

      <span
        className={`text-center text-[11.5px] font-semibold text-[#49394d] group-hover:${current.text}`}
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
    sky: {
      icon: "bg-[#f7f3ed] text-[#9b7740]",
      circle: "bg-[#9b7740]",
    },
  };

  const current = tones[tone];

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

      <div className="text-[28px] font-extrabold leading-none tracking-tight text-[#32143b]">
        {value}
      </div>

      <div className="mt-1 text-[12.5px] font-semibold text-[#756b78]">
        {title}
      </div>

      <div className="mt-1 text-[10.5px] font-medium text-[#8b778e]">
        {label}
      </div>

      <div className="mt-3">

        <span
          className={`inline-flex items-center gap-1 rounded-none px-2 py-1 text-[10px] font-semibold ${
            changeType === "up"
              ? "bg-[#f7f3ed] text-[#9b7740]"
              : changeType === "down"
              ? "bg-red-50 text-red-500"
              : "bg-[#eee8ed] text-[#756b78]"
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
    <th className="px-4 py-3 text-left text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
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
    <div className="rounded-none border border-[#e2d9df] bg-white p-5">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-none ${color}`}
        >
          <Icon size={18} />
        </div>

        <ArrowRight
          size={15}
          className="text-[#bca9c0]"
        />

      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
        {title}
      </p>

      <p className="mt-1 text-[25px] font-extrabold tracking-tight text-[#32143b]">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
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
    <div className="rounded-none border border-[#e2d9df] bg-[#f7f3ed] p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#9b7740] text-[11px] font-extrabold text-white">
          {number}
        </div>

        <p className="text-[11.5px] font-bold text-[#49394d]">
          {title}
        </p>

      </div>

      <p className="mt-3 text-[10px] leading-5 text-[#8b778e]">
        {text}
      </p>

    </div>
  );
}

export default StaffDashboard;
