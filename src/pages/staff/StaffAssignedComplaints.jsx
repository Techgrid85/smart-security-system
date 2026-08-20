import PageLoader from "../../components/dashboard/PageLoader";
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
        <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9.5px] font-bold text-[#9b7740]">
          <CheckCircle2 size={11} />
          Resolved
        </span>
      );
    }

    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[9.5px] font-bold text-[#9b7740]">
          <Clock3 size={11} />
          In Progress
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-red-50 px-2.5 py-1 text-[9.5px] font-bold text-red-600">
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
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Maintenance Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Assigned Complaints
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              View and manage complaints assigned to you.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchComplaints}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-none border border-[#e2d9df] bg-white px-3 text-[10.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740] disabled:opacity-60"
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

        <div className="mb-5 rounded-none border border-[#e2d9df] bg-white p-4">

          <div className="relative">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by complaint, resident, flat or category..."
              className="h-11 w-full rounded-none border border-[#e2d9df] bg-white pl-10 pr-4 text-[11.5px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed]"
            />

          </div>

        </div>

        {/* ========================================== */}
        {/* TABLE */}
        {/* ========================================== */}

        <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">

                <ClipboardList
                  size={15}
                  className="text-[#9b7740]"
                />

                My Complaints

              </h2>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                {filteredComplaints.length} complaint
                {filteredComplaints.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>

          {/* LOADING */}

          {loading ? (
            <PageLoader message="Loading assigned complaints..." />
          ) : filteredComplaints.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                <CheckCircle2 size={22} />
              </div>

              <h3 className="mt-4 text-[13px] font-bold text-[#49394d]">
                {complaints.length === 0
                  ? "No complaints assigned"
                  : "No matching complaints"}
              </h3>

              <p className="mt-1 text-[10.5px] text-[#8b778e]">
                {complaints.length === 0
                  ? "You currently have no complaints assigned to you."
                  : "Try searching with different information."}
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px] text-left">

                <thead className="border-b border-[#eee8ed] bg-[#f7f3ed]/70">

                  <tr>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Complaint
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Resident
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Flat
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Category
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Submitted
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Update
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredComplaints.map(
                    (complaint) => (

                      <tr
                        key={complaint._id}
                        className="border-b border-[#eee8ed] last:border-0 hover:bg-[#f7f3ed]/20"
                      >

                        {/* COMPLAINT */}

                        <td className="px-5 py-4">

                          <div className="max-w-[240px]">

                            <p className="text-[11px] font-bold text-[#49394d]">
                              {complaint.subject}
                            </p>

                            <p className="mt-1 truncate text-[9.5px] text-[#8b778e]">
                              {complaint.description}
                            </p>

                          </div>

                        </td>

                        {/* RESIDENT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#eee8ed] text-[#756b78]">
                              <User size={14} />
                            </div>

                            <div>

                              <p className="text-[10.5px] font-semibold text-[#756b78]">
                                {complaint.resident?.name ||
                                  "—"}
                              </p>

                              <p className="mt-0.5 flex items-center gap-1 text-[9px] text-[#8b778e]">
                                <Phone size={9} />
                                {complaint.resident?.phone ||
                                  "—"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* FLAT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#756b78]">

                            <Home
                              size={13}
                              className="text-[#8b778e]"
                            />

                            {complaint.flatNo ||
                              complaint.resident?.flatNo ||
                              "—"}

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4">

                          <span className="rounded-none bg-[#eee8ed] px-2.5 py-1 text-[9.5px] font-bold text-[#756b78]">
                            {complaint.category}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4">

                          <p className="text-[9.5px] font-semibold text-[#756b78]">
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
                            className="h-8 rounded-none border border-[#e2d9df] bg-white px-2 text-[9.5px] font-bold text-[#756b78] outline-none focus:border-[#bca16a] disabled:cursor-not-allowed disabled:bg-[#f7f3ed] disabled:opacity-60"
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
