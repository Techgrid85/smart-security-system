import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Wrench,
  Search,
  RefreshCw,
  Loader2,
  User,
  Home,
  Phone,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function StaffInProgress() {
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
  // FETCH IN-PROGRESS COMPLAINTS
  // ==========================================

  const fetchInProgressComplaints = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/staff/assigned",
        config
      );

      const assignedComplaints = response.data?.data || [];

      const inProgress = assignedComplaints.filter(
        (complaint) =>
          complaint.status === "In Progress"
      );

      setComplaints(inProgress);
    } catch (error) {
      console.error(
        "Fetch In Progress Complaints Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load in-progress complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInProgressComplaints();
  }, []);

  // ==========================================
  // MARK AS COMPLETED
  // ==========================================

  const markCompleted = async (complaintId) => {
    try {
      setUpdatingId(complaintId);

      const response = await axios.put(
        `https://smart-society-backend-delta.vercel.app/staff/assigned/${complaintId}/status`,
        {
          status: "Resolved",
        },
        config
      );

      toast.success(
        response.data?.message ||
          "Complaint marked as completed"
      );

      // Remove from In Progress immediately
      setComplaints((prev) =>
        prev.filter(
          (complaint) =>
            complaint._id !== complaintId
        )
      );
    } catch (error) {
      console.error(
        "Complete Complaint Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to complete complaint"
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

  return (
    <DashboardLayout role="staff">
      <div className="w-full">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

          <div>
            <div className="mb-1 flex items-center gap-2">

              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
                Maintenance Portal
              </p>

              {complaints.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f7f3ed] px-2 py-0.5 text-[8px] font-bold text-[#9b7740]">
                  <Wrench size={10} />
                  Active Work
                </span>
              )}

            </div>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              In Progress
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Manage complaints that are currently being worked on.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchInProgressComplaints}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#e2d9df] bg-white px-3 text-[10.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740] disabled:opacity-60"
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
        {/* STATS + SEARCH */}
        {/* ========================================== */}

        <div className="mb-5 grid gap-4 lg:grid-cols-[180px_1fr]">

          {/* COUNT */}

          <div className="rounded-[16px] border border-[#e2d9df] bg-[#f7f3ed] p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-wide text-[#9b7740]">
                  Active Work
                </p>

                <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#32143b]">
                  {complaints.length}
                </h2>

                <p className="mt-1 text-[9px] font-medium text-[#9b7740]">
                  Currently in progress
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#9b7740]">
                <Wrench size={19} />
              </div>

            </div>

          </div>

          {/* SEARCH */}

          <div className="flex items-center rounded-[16px] border border-[#e2d9df] bg-white p-4">

            <div className="relative w-full">

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
                className="h-11 w-full rounded-xl border border-[#e2d9df] bg-white pl-10 pr-4 text-[11.5px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed]"
              />

            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* TABLE */}
        {/* ========================================== */}

        <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">

                <Wrench
                  size={15}
                  className="text-[#9b7740]"
                />

                Active Maintenance Work

              </h2>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                {filteredComplaints.length} active complaint
                {filteredComplaints.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="flex items-center justify-center py-16">

              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8b778e]">

                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Loading active work...

              </div>

            </div>

          ) : filteredComplaints.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#9b7740]">
                <CheckCircle2 size={22} />
              </div>

              <h3 className="mt-4 text-[13px] font-bold text-[#49394d]">
                No work in progress
              </h3>

              <p className="mt-1 text-[10.5px] text-[#8b778e]">
                You currently have no complaints being worked on.
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
                      Started
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Action
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

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eee8ed] text-[#756b78]">
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

                          <span className="rounded-full bg-[#eee8ed] px-2.5 py-1 text-[9.5px] font-bold text-[#756b78]">
                            {complaint.category}
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4">

                          <p className="text-[9.5px] font-semibold text-[#756b78]">
                            {formatDate(
                              complaint.updatedAt
                            )}
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f7f3ed] px-2.5 py-1 text-[9.5px] font-bold text-[#9b7740]">
                            <Clock3 size={11} />
                            In Progress
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              markCompleted(
                                complaint._id
                              )
                            }
                            disabled={
                              updatingId ===
                              complaint._id
                            }
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#9b7740] px-3 text-[9.5px] font-bold text-white transition hover:bg-[#9b7740] disabled:cursor-not-allowed disabled:opacity-60"
                          >

                            {updatingId ===
                            complaint._id ? (
                              <>
                                <Loader2
                                  size={13}
                                  className="animate-spin"
                                />

                                Updating...
                              </>
                            ) : (
                              <>
                                <CheckCircle2
                                  size={13}
                                />

                                Mark Completed
                              </>
                            )}

                          </button>

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

export default StaffInProgress;