import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ClipboardList,
  Search,
  RefreshCw,
  Loader2,
  User,
  Home,
  Phone,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function StaffAssignedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH ASSIGNED COMPLAINTS
  // ==========================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/staff/assigned",
        config
      );

      setComplaints(response.data?.data || []);
    } catch (error) {
      console.error(
        "Fetch Assigned Complaints Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load assigned complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (complaintId, status) => {
    try {
      setUpdatingId(complaintId);

      const response = await axios.put(
        `https://smart-society-backend-delta.vercel.app/staff/assigned/${complaintId}/status`,
        { status },
        config
      );

      toast.success(
        response.data?.message ||
          "Complaint status updated"
      );

      // Update immediately in UI
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId
            ? {
                ...complaint,
                status,
              }
            : complaint
        )
      );
    } catch (error) {
      console.error(
        "Update Complaint Status Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint status"
      );
    } finally {
      setUpdatingId("");
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredComplaints = complaints.filter(
    (complaint) => {
      const value = search.toLowerCase().trim();

      if (!value) return true;

      return (
        complaint.subject
          ?.toLowerCase()
          .includes(value) ||
        complaint.description
          ?.toLowerCase()
          .includes(value) ||
        complaint.category
          ?.toLowerCase()
          .includes(value) ||
        complaint.flatNo
          ?.toLowerCase()
          .includes(value) ||
        complaint.resident?.name
          ?.toLowerCase()
          .includes(value)
      );
    }
  );

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const StatusBadge = ({ status }) => {
    if (status === "Resolved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9.5px] font-bold text-emerald-600">
          <CheckCircle2 size={11} />
          Resolved
        </span>
      );
    }

    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[9.5px] font-bold text-amber-600">
          <Clock3 size={11} />
          In Progress
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[9.5px] font-bold text-red-600">
        <AlertCircle size={11} />
        Pending
      </span>
    );
  };

  return (
    <DashboardLayout role="staff">
      <div className="w-full">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Maintenance Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
              Assigned Complaints
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              View and manage complaints assigned to you.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchComplaints}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[10.5px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* ========================================== */}
        {/* SEARCH */}
        {/* ========================================== */}

        <div className="mb-5 rounded-[16px] border border-slate-200 bg-white p-4">

          <div className="relative">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by complaint, resident, flat or category..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[11.5px] font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
            />

          </div>

        </div>

        {/* ========================================== */}
        {/* TABLE */}
        {/* ========================================== */}

        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">

                <ClipboardList
                  size={15}
                  className="text-emerald-500"
                />

                My Complaints

              </h2>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                {filteredComplaints.length} complaint
                {filteredComplaints.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>

          {/* LOADING */}

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

          ) : filteredComplaints.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <CheckCircle2 size={22} />
              </div>

              <h3 className="mt-4 text-[13px] font-bold text-slate-700">
                {complaints.length === 0
                  ? "No complaints assigned"
                  : "No matching complaints"}
              </h3>

              <p className="mt-1 text-[10.5px] text-slate-400">
                {complaints.length === 0
                  ? "You currently have no complaints assigned to you."
                  : "Try searching with different information."}
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/70">

                  <tr>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Complaint
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Resident
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Flat
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Submitted
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Update
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredComplaints.map(
                    (complaint) => (

                      <tr
                        key={complaint._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/20"
                      >

                        {/* COMPLAINT */}

                        <td className="px-5 py-4">

                          <div className="max-w-[240px]">

                            <p className="text-[11px] font-bold text-slate-700">
                              {complaint.subject}
                            </p>

                            <p className="mt-1 truncate text-[9.5px] text-slate-400">
                              {complaint.description}
                            </p>

                          </div>

                        </td>

                        {/* RESIDENT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              <User size={14} />
                            </div>

                            <div>

                              <p className="text-[10.5px] font-semibold text-slate-600">
                                {complaint.resident?.name ||
                                  "—"}
                              </p>

                              <p className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400">
                                <Phone size={9} />
                                {complaint.resident?.phone ||
                                  "—"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* FLAT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">

                            <Home
                              size={13}
                              className="text-slate-400"
                            />

                            {complaint.flatNo ||
                              complaint.resident?.flatNo ||
                              "—"}

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4">

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9.5px] font-bold text-slate-600">
                            {complaint.category}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4">

                          <p className="text-[9.5px] font-semibold text-slate-600">
                            {formatDate(
                              complaint.createdAt
                            )}
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={complaint.status}
                          />

                        </td>

                        {/* UPDATE */}

                        <td className="px-5 py-4 text-right">

                          <select
                            value={complaint.status}
                            disabled={
                              updatingId ===
                              complaint._id ||
                              complaint.status ===
                                "Resolved"
                            }
                            onChange={(e) =>
                              updateStatus(
                                complaint._id,
                                e.target.value
                              )
                            }
                            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[9.5px] font-bold text-slate-600 outline-none focus:border-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="In Progress">
                              In Progress
                            </option>

                            <option value="Resolved">
                              Resolved
                            </option>

                          </select>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>
    </DashboardLayout>
  );
}

export default StaffAssignedComplaints;