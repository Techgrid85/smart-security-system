import PageLoader from "../../components/dashboard/PageLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Users,
  MessageSquareWarning,
  ShieldCheck,
  UserPlus,
  FileText,
  UserCheck,
  Megaphone,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle,
  UserCog,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL =
  "https://smart-society-backend-delta.vercel.app";

const quickActions = [
  {
    title: "Add Resident",
    icon: UserPlus,
    bg: "bg-[#f5eee2]",
    color: "text-[#9b7740]",
  },
  {
    title: "Generate Bill",
    icon: FileText,
    bg: "bg-[#f1eaf3]",
    color: "text-[#32143b]",
  },
  {
    title: "Manage Visitors",
    icon: UserCheck,
    bg: "bg-[#f7f0df]",
    color: "text-[#9b7740]",
  },
  {
    title: "Create Notice",
    icon: Megaphone,
    bg: "bg-[#f1eaf3]",
    color: "text-[#32143b]",
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
  const complaintsData =
    dashboardData?.complaints || {};
  const visitorsData =
    dashboardData?.visitors || {};

  const recentComplaints =
    dashboardData?.recentComplaints || [];

  const recentVisitors =
    dashboardData?.recentVisitors || [];

  const openComplaints =
    (complaintsData.pending || 0) +
    (complaintsData.inProgress || 0);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <PageLoader message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div
            className="
              max-w-md
              rounded-none
              border
              border-red-200
              bg-white
              p-6
              text-center
              shadow-[0_10px_35px_rgba(50,20,59,0.06)]
            "
          >
            <AlertCircle
              size={32}
              className="mx-auto text-red-500"
            />

            <h2 className="mt-3 text-base font-bold text-[#32143b]">
              Failed to Load Dashboard
            </h2>

            <p className="mt-2 text-sm text-[#32143b]/50">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="
                mt-5
                rounded-none
                bg-[#32143b]
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#210c28]
              "
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

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-6 flex items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-[#9b7740]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9b7740]">
                Administration
              </span>
            </div>

            <h1 className="mt-2 text-[21px] font-extrabold tracking-tight text-[#32143b] md:text-[23px]">
              Society Overview
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#32143b]/45">
              Monitor residents, staff, security and daily society activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/residents")
            }
            className="
              hidden
              items-center
              gap-2
              rounded-none
              bg-[#9b7740]
              px-4
              py-2.5
              text-[11px]
              font-bold
              text-white
              shadow-[0_5px_18px_rgba(155,119,64,0.22)]
              transition
              hover:bg-[#866637]
              sm:flex
            "
          >
            <UserPlus size={15} />
            Add Resident
          </button>

        </div>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

          <StatCard
            title="Total Residents"
            value={users.residents?.total || 0}
            label={`${users.residents?.active || 0} active residents`}
            icon={Users}
            tone="gold"
            changeType="up"
            change="Registered residents"
          />

          <StatCard
            title="Maintenance Staff"
            value={users.staff?.total || 0}
            label={`${users.staff?.active || 0} active staff`}
            icon={UserCog}
            tone="purple"
            changeType="neutral"
            change="Staff members"
          />

          <StatCard
            title="Security Guards"
            value={users.guards?.total || 0}
            label={`${users.guards?.active || 0} active guards`}
            icon={ShieldCheck}
            tone="gold"
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

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section
          className="
            mt-6
            overflow-hidden
            rounded-none
            border
            border-[#32143b]/10
            bg-white
            shadow-[0_5px_25px_rgba(50,20,59,0.035)]
          "
        >

          <div
            className="
              flex
              items-center
              border-b
              border-[#32143b]/10
              px-5
              py-4
            "
          >
            <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
              <span className="text-[#9b7740]">⚡</span>
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
                    if (
                      action.title === "Add Resident"
                    ) {
                      navigate("/admin/residents");
                    }

                    if (
                      action.title === "Manage Visitors"
                    ) {
                      navigate("/admin/visitors");
                    }

                    if (
                      action.title === "Generate Bill"
                    ) {
                      navigate("/admin/bills");
                    }

                    if (
                      action.title === "Create Notice"
                    ) {
                      navigate("/admin/notices");
                    }
                  }}
                  className="
                    group
                    flex
                    min-h-[112px]
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    rounded-none
                    border-[1.5px]
                    border-dashed
                    border-[#32143b]/10
                    bg-[#fcfafc]
                    px-4
                    text-center
                    transition
                    duration-200
                    hover:border-[#9b7740]/60
                    hover:bg-[#fdf9f2]
                  "
                >

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-none
                      ${action.bg}
                      ${action.color}
                      transition
                      duration-200
                      group-hover:scale-110
                    `}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className="
                      text-[11.5px]
                      font-semibold
                      text-[#32143b]/80
                      group-hover:text-[#9b7740]
                    "
                  >
                    {action.title}
                  </span>

                </button>
              );
            })}

          </div>
        </section>

        {/* =================================================
            RECENT COMPLAINTS + GATE ACTIVITY
        ================================================= */}

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)]">

          {/* RECENT COMPLAINTS */}

          <section
            className="
              overflow-hidden
              rounded-none
              border
              border-[#32143b]/10
              bg-white
              shadow-[0_5px_25px_rgba(50,20,59,0.035)]
            "
          >

            <div className="flex items-center justify-between border-b border-[#32143b]/10 px-5 py-4">

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                <MessageSquareWarning
                  size={16}
                  className="text-[#9b7740]"
                />
                Recent Complaints
              </h2>

              <button
                onClick={() =>
                  navigate("/admin/complaints")
                }
                className="text-[11.5px] font-semibold text-[#9b7740] transition hover:text-[#32143b]"
              >
                View All →
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] border-collapse">

                <thead>
                  <tr className="bg-[#faf8fb]">

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#32143b]/35">
                      ID
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#32143b]/35">
                      Issue
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#32143b]/35">
                      Flat
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#32143b]/35">
                      Category
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#32143b]/35">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {recentComplaints.length > 0 ? (
                    recentComplaints.map(
                      (complaint) => (
                        <tr
                          key={complaint._id}
                          className="
                            border-t
                            border-[#32143b]/8
                            transition
                            hover:bg-[#fcfafc]
                          "
                        >

                          <td className="px-4 py-3.5 text-[12px] font-bold text-[#9b7740]">
                            #{complaint._id
                              .slice(-5)
                              .toUpperCase()}
                          </td>

                          <td className="px-4 py-3.5">

                            <p className="text-[12px] font-semibold text-[#32143b]">
                              {complaint.subject}
                            </p>

                            <p className="mt-1 text-[10.5px] font-medium text-[#32143b]/40">
                              {complaint.resident?.name ||
                                "Unknown Resident"}
                            </p>

                          </td>

                          <td className="px-4 py-3.5 text-[12px] font-medium text-[#32143b]/65">
                            {complaint.flatNo ||
                              complaint.resident?.flatNo ||
                              "N/A"}
                          </td>

                          <td className="px-4 py-3.5">

                            <span className="rounded-none bg-[#f4f0f5] px-2 py-1 text-[10px] font-bold text-[#32143b]/60">
                              {complaint.category}
                            </span>

                          </td>

                          <td className="px-4 py-3.5">
                            <StatusBadge
                              status={complaint.status}
                            />
                          </td>

                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-10 text-center text-sm text-[#32143b]/35"
                      >
                        No complaints found
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          </section>

          {/* GATE ACTIVITY */}

          <section
            className="
              rounded-none
              border
              border-[#32143b]/10
              bg-white
              shadow-[0_5px_25px_rgba(50,20,59,0.035)]
            "
          >

            <div className="flex items-center justify-between border-b border-[#32143b]/10 px-5 py-4">

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                <ShieldCheck
                  size={16}
                  className="text-[#9b7740]"
                />
                Gate Activity
              </h2>

              <button
                onClick={() =>
                  navigate("/admin/security")
                }
                className="text-[11.5px] font-semibold text-[#9b7740]"
              >
                View Logs →
              </button>

            </div>

            <div className="space-y-2.5 p-5">

              {recentVisitors.length > 0 ? (
                recentVisitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-none
                      border
                      border-[#32143b]/8
                      bg-[#fcfafc]
                      px-3
                      py-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-none
                        bg-[#f4eee4]
                        text-[#9b7740]
                      "
                    >
                      <ShieldCheck size={17} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-[11.5px] font-bold text-[#32143b]">
                        {visitor.visitorName}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] font-medium text-[#32143b]/40">
                        {visitor.isWalkIn
                          ? "Walk-in"
                          : "Visitor"}{" "}
                        · Flat {visitor.flatNo}
                      </p>

                    </div>

                    <span className="shrink-0 text-[9.5px] font-semibold text-[#32143b]/40">
                      {visitor.gateStatus}
                    </span>

                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-[#32143b]/35">
                  No visitor activity found
                </p>
              )}

            </div>
          </section>

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,1fr)]">

          {/* COMPLAINT OVERVIEW */}

          <section
            className="
              rounded-none
              border
              border-[#32143b]/10
              bg-white
              shadow-[0_5px_25px_rgba(50,20,59,0.035)]
            "
          >

            <div className="flex items-center justify-between border-b border-[#32143b]/10 px-5 py-4">

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">

                <MessageSquareWarning
                  size={16}
                  className="text-[#9b7740]"
                />

                Complaint Overview

              </h2>

              <span className="text-[10.5px] font-medium text-[#32143b]/35">
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
                value={
                  complaintsData.inProgress || 0
                }
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
                value={
                  complaintsData.unassigned || 0
                }
              />

            </div>

          </section>

          {/* VISITOR SUMMARY */}

          <section
            className="
              rounded-none
              border
              border-[#32143b]/10
              bg-white
              shadow-[0_5px_25px_rgba(50,20,59,0.035)]
            "
          >

            <div className="border-b border-[#32143b]/10 px-5 py-4">

              <h2 className="text-[13px] font-bold text-[#32143b]">
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


/* =========================================================
   STAT CARD
========================================================= */

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
    gold: {
      icon: "bg-[#f5eee2] text-[#9b7740]",
      circle: "bg-[#9b7740]",
    },

    purple: {
      icon: "bg-[#f1eaf3] text-[#32143b]",
      circle: "bg-[#32143b]",
    },

    red: {
      icon: "bg-red-50 text-red-500",
      circle: "bg-red-500",
    },
  };

  const current = styles[tone];

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-none
        border
        border-[#32143b]/10
        bg-white
        p-5
        shadow-[0_5px_25px_rgba(50,20,59,0.035)]
      "
    >

      <div
        className={`
          absolute
          -right-5
          -top-5
          h-20
          w-20
          rounded-none
          opacity-[0.06]
          ${current.circle}
        `}
      />

      <div
        className={`
          mb-4
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-none
          ${current.icon}
        `}
      >
        <Icon size={20} />
      </div>

      <div className="text-[28px] font-extrabold leading-none tracking-tight text-[#32143b]">
        {value}
      </div>

      <div className="mt-1 text-[12.5px] font-semibold text-[#32143b]/70">
        {title}
      </div>

      <div className="mt-1 text-[10.5px] font-medium text-[#32143b]/40">
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


/* =========================================================
   CHANGE BADGE
========================================================= */

function ChangeBadge({ type, text }) {

  if (type === "up") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1
          rounded-none
          bg-[#f4eee4]
          px-2
          py-1
          text-[10px]
          font-semibold
          text-[#9b7740]
        "
      >
        <ArrowUp size={11} />
        {text}
      </span>
    );
  }

  if (type === "down") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1
          rounded-none
          bg-red-50
          px-2
          py-1
          text-[10px]
          font-semibold
          text-red-500
        "
      >
        <ArrowDown size={11} />
        {text}
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1
        rounded-none
        bg-[#f4f0f5]
        px-2
        py-1
        text-[10px]
        font-semibold
        text-[#32143b]/50
      "
    >
      <Minus size={11} />
      {text}
    </span>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700">
        <span className="h-1.5 w-1.5 rounded-none bg-red-500" />
        Pending
      </span>
    );
  }

  if (status === "In Progress") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
        <span className="h-1.5 w-1.5 rounded-none bg-amber-500" />
        In Progress
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700">
        <span className="h-1.5 w-1.5 rounded-none bg-red-500" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-none bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-none bg-emerald-500" />
      Resolved
    </span>
  );
}


/* =========================================================
   SUMMARY BOX
========================================================= */

function SummaryBox({ label, value }) {
  return (
    <div
      className="
        rounded-none
        border
        border-[#32143b]/8
        bg-[#fcfafc]
        px-4
        py-3
      "
    >
      <p className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-[#32143b]/35">
        {label}
      </p>

      <p className="mt-1 text-[21px] font-extrabold text-[#32143b]">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;
