import { useEffect, useState } from "react";
import axios from "axios";
import {
  History,
  ClipboardList,
  UserCircle,
  Home,
  CalendarDays,
  Eye,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function StaffComplaintHistory() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaintHistory();
  }, []);

  const fetchComplaintHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/staff/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(response.data.data || []);
    } catch (error) {
      console.error("Fetch Complaint History Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load complaint history"
      );
    } finally {
      setLoading(false);
    }
  };

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const pendingCount = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  return (
    <DashboardLayout role="staff">
      <div className="w-full">

        {/* HEADER */}
        <div className="mb-6">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
            Maintenance Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
            Complaint History
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-slate-400">
            View the complete history of complaints assigned to you.
          </p>
        </div>


        {/* SUMMARY */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">

          <HistoryStat
            icon={ClipboardList}
            title="Total"
            value={complaints.length}
            text="Assigned complaints"
            iconClass="bg-slate-50 text-slate-500"
          />

          <HistoryStat
            icon={Clock3}
            title="Pending"
            value={pendingCount}
            text="Awaiting work"
            iconClass="bg-red-50 text-red-500"
          />

          <HistoryStat
            icon={Clock3}
            title="In Progress"
            value={inProgressCount}
            text="Currently working"
            iconClass="bg-amber-50 text-amber-500"
          />

          <HistoryStat
            icon={CheckCircle2}
            title="Resolved"
            value={resolvedCount}
            text="Completed work"
            iconClass="bg-emerald-50 text-emerald-500"
          />

        </div>


        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[11px] font-semibold text-red-600">
            {error}
          </div>
        )}


        {/* HISTORY TABLE */}
        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">

              <History
                size={16}
                className="text-emerald-500"
              />

              All Assigned Complaints

            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
              {complaints.length} Records
            </span>

          </div>


          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <p className="text-[11px] font-semibold text-slate-400">
                Loading complaint history...
              </p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                <History
                  size={22}
                  className="text-slate-300"
                />
              </div>

              <p className="text-[13px] font-bold text-slate-700">
                No complaint history
              </p>

              <p className="mt-1 max-w-sm text-[10.5px] font-medium leading-5 text-slate-400">
                Complaints assigned to you will appear here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] border-collapse">

                <thead>
                  <tr className="bg-slate-50">

                    <TableHead>Complaint</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>

                  </tr>
                </thead>

                <tbody>

                  {complaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >

                      {/* COMPLAINT */}
                      <td className="px-4 py-4">

                        <p className="max-w-[200px] truncate text-[11.5px] font-bold text-slate-700">
                          {complaint.subject}
                        </p>

                        <p className="mt-1 text-[9.5px] font-medium text-slate-400">
                          #{complaint._id.slice(-8).toUpperCase()}
                        </p>

                      </td>


                      {/* RESIDENT */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                            <UserCircle
                              size={15}
                              className="text-slate-400"
                            />
                          </div>

                          <div>
                            <p className="text-[10.5px] font-bold text-slate-700">
                              {complaint.resident?.name || "Unknown"}
                            </p>

                            <p className="text-[9px] text-slate-400">
                              {complaint.resident?.phone || "—"}
                            </p>
                          </div>

                        </div>

                      </td>


                      {/* FLAT */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-600">

                          <Home
                            size={13}
                            className="text-slate-400"
                          />

                          {complaint.flatNo || "—"}

                        </div>

                      </td>


                      {/* CATEGORY */}
                      <td className="px-4 py-4">

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9.5px] font-bold text-slate-600">
                          {complaint.category}
                        </span>

                      </td>


                      {/* CREATED */}
                      <td className="px-4 py-4">

                        <DateDisplay
                          date={complaint.createdAt}
                        />

                      </td>


                      {/* UPDATED */}
                      <td className="px-4 py-4">

                        <DateDisplay
                          date={complaint.updatedAt}
                        />

                      </td>


                      {/* STATUS */}
                      <td className="px-4 py-4">

                        <StatusBadge
                          status={complaint.status}
                        />

                      </td>


                      {/* ACTION */}
                      <td className="px-4 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            window.location.href =
                              `/staff/assigned/${complaint._id}`
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[9.5px] font-bold text-slate-500 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Eye size={12} />
                          View
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </DashboardLayout>
  );
}


/* ================= HISTORY STAT ================= */

function HistoryStat({
  icon: Icon,
  title,
  value,
  text,
  iconClass,
}) {
  return (
    <div className="rounded-[16px] border border-slate-200 bg-white p-5">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={18} />
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


/* ================= TABLE HEAD ================= */

function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[9.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
      {children}
    </th>
  );
}


/* ================= DATE ================= */

function DateDisplay({ date }) {
  if (!date) {
    return (
      <span className="text-[10px] font-semibold text-slate-400">
        —
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">

      <CalendarDays
        size={12}
        className="text-slate-400"
      />

      {formatDate(date)}

    </div>
  );
}


/* ================= STATUS ================= */

function StatusBadge({ status }) {
  const styles = {
    Pending:
      "bg-red-50 text-red-700",
    "In Progress":
      "bg-amber-50 text-amber-700",
    Resolved:
      "bg-emerald-50 text-emerald-700",
    Rejected:
      "bg-slate-100 text-slate-500",
  };

  const dots = {
    Pending: "bg-red-500",
    "In Progress": "bg-amber-500",
    Resolved: "bg-emerald-500",
    Rejected: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] font-bold ${
        styles[status] || "bg-slate-100 text-slate-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dots[status] || "bg-slate-400"
        }`}
      />

      {status}
    </span>
  );
}


/* ================= DATE FORMAT ================= */

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default StaffComplaintHistory;