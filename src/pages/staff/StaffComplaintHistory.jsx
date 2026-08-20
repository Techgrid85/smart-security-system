import PageLoader from "../../components/dashboard/PageLoader";
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
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
            Maintenance Portal
          </p>

          <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
            Complaint History
          </h1>

          <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
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
            iconClass="bg-[#f7f3ed] text-[#756b78]"
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
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <HistoryStat
            icon={CheckCircle2}
            title="Resolved"
            value={resolvedCount}
            text="Completed work"
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

        </div>


        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-none border border-red-200 bg-red-50 px-4 py-3 text-[11px] font-semibold text-red-600">
            {error}
          </div>
        )}


        {/* HISTORY TABLE */}
        <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">

              <History
                size={16}
                className="text-[#9b7740]"
              />

              All Assigned Complaints

            </h2>

            <span className="rounded-none bg-[#eee8ed] px-2.5 py-1 text-[10px] font-bold text-[#756b78]">
              {complaints.length} Records
            </span>

          </div>


          {loading ? (
            <PageLoader message="Loading complaint history..." />
          ) : complaints.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-none bg-[#f7f3ed]">
                <History
                  size={22}
                  className="text-[#bca9c0]"
                />
              </div>

              <p className="text-[13px] font-bold text-[#49394d]">
                No complaint history
              </p>

              <p className="mt-1 max-w-sm text-[10.5px] font-medium leading-5 text-[#8b778e]">
                Complaints assigned to you will appear here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] border-collapse">

                <thead>
                  <tr className="bg-[#f7f3ed]">

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
                      className="border-t border-[#e2d9df] transition hover:bg-[#f7f3ed]"
                    >

                      {/* COMPLAINT */}
                      <td className="px-4 py-4">

                        <p className="max-w-[200px] truncate text-[11.5px] font-bold text-[#49394d]">
                          {complaint.subject}
                        </p>

                        <p className="mt-1 text-[9.5px] font-medium text-[#8b778e]">
                          #{complaint._id.slice(-8).toUpperCase()}
                        </p>

                      </td>


                      {/* RESIDENT */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#eee8ed]">
                            <UserCircle
                              size={15}
                              className="text-[#8b778e]"
                            />
                          </div>

                          <div>
                            <p className="text-[10.5px] font-bold text-[#49394d]">
                              {complaint.resident?.name || "Unknown"}
                            </p>

                            <p className="text-[9px] text-[#8b778e]">
                              {complaint.resident?.phone || "—"}
                            </p>
                          </div>

                        </div>

                      </td>


                      {/* FLAT */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#756b78]">

                          <Home
                            size={13}
                            className="text-[#8b778e]"
                          />

                          {complaint.flatNo || "—"}

                        </div>

                      </td>


                      {/* CATEGORY */}
                      <td className="px-4 py-4">

                        <span className="rounded-none bg-[#eee8ed] px-2.5 py-1 text-[9.5px] font-bold text-[#756b78]">
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
                          className="inline-flex items-center gap-1.5 rounded-none border border-[#e2d9df] px-2.5 py-1.5 text-[9.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:bg-[#f7f3ed] hover:text-[#9b7740]"
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
    <div className="rounded-none border border-[#e2d9df] bg-white p-5">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-none ${iconClass}`}
      >
        <Icon size={18} />
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


/* ================= TABLE HEAD ================= */

function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#8b778e]">
      {children}
    </th>
  );
}


/* ================= DATE ================= */

function DateDisplay({ date }) {
  if (!date) {
    return (
      <span className="text-[10px] font-semibold text-[#8b778e]">
        —
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#756b78]">

      <CalendarDays
        size={12}
        className="text-[#8b778e]"
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
      "bg-[#f7f3ed] text-[#826331]",
    Resolved:
      "bg-[#f7f3ed] text-[#826331]",
    Rejected:
      "bg-[#eee8ed] text-[#756b78]",
  };

  const dots = {
    Pending: "bg-red-500",
    "In Progress": "bg-[#9b7740]",
    Resolved: "bg-[#9b7740]",
    Rejected: "bg-[#8b778e]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-none px-2.5 py-1 text-[9.5px] font-bold ${
        styles[status] || "bg-[#eee8ed] text-[#756b78]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-none ${
          dots[status] || "bg-[#8b778e]"
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
