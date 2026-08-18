import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MessageSquareWarning,
  Search,
  Filter,
  UserCog,
  RefreshCw,
  X,
  User,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Wrench,
  Image as ImageIcon,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [adminRemark, setAdminRemark] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // AXIOS CONFIG
  // ==========================================
  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH COMPLAINTS
  // ==========================================
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/admin/complaints`,
        authConfig
      );

      setComplaints(response.data.data || []);
    } catch (error) {
      console.error(
        "Fetch Complaints Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH STAFF
  // ==========================================
  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/staff`,
        authConfig
      );

      setStaff(response.data.data || []);
    } catch (error) {
      console.error(
        "Fetch Staff Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch staff members"
      );
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================
  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  // ==========================================
  // OPEN ASSIGN MODAL
  // ==========================================
  const openAssignModal = (complaint) => {
    setSelectedComplaint(complaint);

    setSelectedStaff(
      complaint.assignedStaff?._id || ""
    );

    setAdminRemark(
      complaint.adminRemark || ""
    );
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const closeModal = () => {
    setSelectedComplaint(null);
    setSelectedStaff("");
    setAdminRemark("");
  };

  // ==========================================
  // ASSIGN STAFF
  // ==========================================
  const handleAssignStaff = async (e) => {
    e.preventDefault();

    if (!selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }

    try {
      setAssignLoading(true);

      const response = await axios.put(
        `${API_URL}/admin/complaints/${selectedComplaint._id}/assign`,
        {
          staffId: selectedStaff,
          adminRemark,
        },
        authConfig
      );

      toast.success(
        response.data.message ||
          "Staff assigned successfully"
      );

      closeModal();
      fetchComplaints();
    } catch (error) {
      console.error(
        "Assign Staff Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to assign staff"
      );
    } finally {
      setAssignLoading(false);
    }
  };

  // ==========================================
  // FILTER COMPLAINTS
  // ==========================================
  const filteredComplaints = complaints.filter(
    (complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.subject?.toLowerCase().includes(searchText) ||
        complaint.description?.toLowerCase().includes(searchText) ||
        complaint.category?.toLowerCase().includes(searchText) ||
        complaint.flatNo?.toLowerCase().includes(searchText) ||
        complaint.resident?.name
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <DashboardLayout role="admin">
      <div className="w-full">

        {/* ================= PAGE HEADER ================= */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-[20px] font-extrabold text-slate-900 md:text-[22px]">
              <MessageSquareWarning
                size={22}
                className="text-emerald-500"
              />
              Complaints Management
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Review resident complaints and assign maintenance staff.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchComplaints}
            className="inline-flex items-center justify-center gap-2 rounded-[9px] border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">

          <SummaryCard
            title="Total Complaints"
            value={complaints.length}
            icon={MessageSquareWarning}
            tone="blue"
          />

          <SummaryCard
            title="Pending"
            value={
              complaints.filter(
                (item) => item.status === "Pending"
              ).length
            }
            icon={Clock3}
            tone="yellow"
          />

          <SummaryCard
            title="In Progress"
            value={
              complaints.filter(
                (item) => item.status === "In Progress"
              ).length
            }
            icon={Wrench}
            tone="orange"
          />

          <SummaryCard
            title="Resolved"
            value={
              complaints.filter(
                (item) => item.status === "Resolved"
              ).length
            }
            icon={CheckCircle2}
            tone="green"
          />

        </div>

        {/* ================= COMPLAINTS CARD ================= */}
        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          {/* ================= TOOLBAR ================= */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-[380px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full rounded-[10px] border border-slate-200 py-2.5 pl-10 pr-4 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter
                size={15}
                className="text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-semibold text-slate-600 outline-none focus:border-emerald-400"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>

          </div>

          {/* ================= TABLE ================= */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] border-collapse">

              <thead>
                <tr className="bg-slate-50">

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                    Complaint
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                    Resident
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                    Category
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                    Assigned Staff
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-14 text-center text-[12px] font-medium text-slate-400"
                    >
                      Loading complaints...
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-14 text-center"
                    >
                      <AlertCircle
                        size={28}
                        className="mx-auto mb-3 text-slate-300"
                      />

                      <p className="text-[12px] font-semibold text-slate-500">
                        No complaints found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >

                      {/* Complaint */}
                      <td className="max-w-[300px] px-5 py-4">
                        <p className="truncate text-[12px] font-bold text-slate-800">
                          {complaint.subject}
                        </p>

                        <p className="mt-1 line-clamp-1 text-[10.5px] font-medium text-slate-400">
                          {complaint.description}
                        </p>

                        <p className="mt-1.5 text-[9.5px] font-medium text-slate-400">
                          {new Date(
                            complaint.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Resident */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                            <User size={14} />
                          </div>

                          <div>
                            <p className="text-[11.5px] font-bold text-slate-700">
                              {complaint.resident?.name ||
                                "Unknown Resident"}
                            </p>

                            <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                              <Building2 size={10} />
                              {complaint.flatNo}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600">
                          {complaint.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={complaint.status}
                        />
                      </td>

                      {/* Staff */}
                      <td className="px-5 py-4">

                        {complaint.assignedStaff ? (
                          <div>
                            <p className="text-[11.5px] font-bold text-slate-700">
                              {complaint.assignedStaff.name}
                            </p>

                            <p className="mt-0.5 text-[10px] font-medium text-emerald-500">
                              Assigned
                            </p>
                          </div>
                        ) : (
                          <span className="text-[10.5px] font-semibold text-red-500">
                            Unassigned
                          </span>
                        )}

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            openAssignModal(complaint)
                          }
                          disabled={
                            complaint.status === "Resolved" ||
                            complaint.status === "Rejected"
                          }
                          className="inline-flex items-center gap-2 rounded-[8px] bg-emerald-500 px-3 py-2 text-[10.5px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <UserCog size={13} />

                          {complaint.assignedStaff
                            ? "Reassign"
                            : "Assign"}
                        </button>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

          {/* ================= FOOTER ================= */}
          {!loading && (
            <div className="border-t border-slate-200 px-5 py-3">
              <p className="text-[10.5px] font-medium text-slate-400">
                Showing {filteredComplaints.length} of{" "}
                {complaints.length} complaints
              </p>
            </div>
          )}

        </section>

      </div>

      {/* ================= ASSIGN STAFF MODAL ================= */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">

          <div className="w-full max-w-[500px] rounded-[18px] bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="text-[15px] font-extrabold text-slate-900">
                  Assign Maintenance Staff
                </h2>

                <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                  Assign a staff member to this complaint.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={17} />
              </button>

            </div>

            <form onSubmit={handleAssignStaff}>

              <div className="space-y-4 p-5">

                {/* Complaint Info */}
                <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    Complaint
                  </p>

                  <p className="mt-1 text-[12px] font-bold text-slate-800">
                    {selectedComplaint.subject}
                  </p>

                  <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                    Flat {selectedComplaint.flatNo} ·{" "}
                    {selectedComplaint.category}
                  </p>

                </div>

                {/* Complaint Image */}
                {selectedComplaint.image && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <ImageIcon size={14} className="text-emerald-500" />

                      <p className="text-[11px] font-bold text-slate-700">
                        Complaint Image
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-[12px] border border-slate-200 bg-slate-50">
                      <img
                        src={selectedComplaint.image}
                        alt="Complaint"
                        className="max-h-[300px] w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Staff Select */}
                <div>

                  <label className="mb-2 block text-[11px] font-bold text-slate-700">
                    Select Staff Member
                  </label>

                  <select
                    value={selectedStaff}
                    onChange={(e) =>
                      setSelectedStaff(e.target.value)
                    }
                    className="w-full rounded-[10px] border border-slate-200 bg-white px-3 py-3 text-[11.5px] font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                  >
                    <option value="">
                      Select staff member
                    </option>

                    {staff.map((member) => (
                      <option
                        key={member._id}
                        value={member._id}
                      >
                        {member.name}
                        {member.phone
                          ? ` - ${member.phone}`
                          : ""}
                      </option>
                    ))}

                  </select>

                </div>

                {/* Admin Remark */}
                <div>

                  <label className="mb-2 block text-[11px] font-bold text-slate-700">
                    Admin Remark
                    <span className="ml-1 font-medium text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    value={adminRemark}
                    onChange={(e) =>
                      setAdminRemark(e.target.value)
                    }
                    placeholder="Add instructions for the assigned staff..."
                    rows="4"
                    className="w-full resize-none rounded-[10px] border border-slate-200 px-3 py-3 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                  />

                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={assignLoading}
                  className="rounded-[9px] border border-slate-200 px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={assignLoading}
                  className="inline-flex items-center gap-2 rounded-[9px] bg-emerald-500 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UserCog size={14} />

                  {assignLoading
                    ? "Assigning..."
                    : selectedComplaint.assignedStaff
                    ? "Update Assignment"
                    : "Assign Staff"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}


// ==========================================
// SUMMARY CARD
// ==========================================
function SummaryCard({
  title,
  value,
  icon: Icon,
  tone,
}) {
  const styles = {
    blue: "bg-sky-50 text-sky-500",
    yellow: "bg-amber-50 text-amber-500",
    orange: "bg-orange-50 text-orange-500",
    green: "bg-emerald-50 text-emerald-500",
  };

  return (
    <div className="rounded-[16px] border border-slate-200 bg-white p-5">

      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${styles[tone]}`}
      >
        <Icon size={20} />
      </div>

      <p className="text-[25px] font-extrabold leading-none text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-[11.5px] font-semibold text-slate-500">
        {title}
      </p>

    </div>
  );
}


// ==========================================
// STATUS BADGE
// ==========================================
function StatusBadge({ status }) {
  const styles = {
    Pending:
      "bg-red-50 text-red-700",

    "In Progress":
      "bg-amber-50 text-amber-700",

    Resolved:
      "bg-emerald-50 text-emerald-700",

    Rejected:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}

export default AdminComplaints;