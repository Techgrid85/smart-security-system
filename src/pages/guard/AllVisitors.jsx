import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  Users,
  Search,
  ArrowLeft,
  RefreshCw,
  Loader2,
  User,
  Phone,
  Home,
  CalendarDays,
  Clock3,
  Eye,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

function AllVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [gateStatus, setGateStatus] = useState("All");

  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // ==========================================
  // AUTH CONFIG
  // ==========================================

  const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ==========================================
  // FETCH ALL VISITORS
  // ==========================================

  const fetchVisitors = async (
    searchValue = search,
    statusValue = status,
    gateStatusValue = gateStatus
  ) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/guard/search`,
        {
          ...getConfig(),
          params: {
            search: searchValue,
            status: statusValue,
            gateStatus: gateStatusValue,
          },
        }
      );

      if (response.data.success) {
        setVisitors(response.data.data || []);
      } else {
        setVisitors([]);
        toast.error(
          response.data.message ||
            "Failed to load visitors"
        );
      }
    } catch (error) {
      console.error(
        "FETCH VISITORS ERROR:",
        error.response?.data || error
      );

      setVisitors([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load visitors"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchVisitors("", "All", "All");
  }, []);

  // ==========================================
  // HANDLE SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    fetchVisitors();
  };

  // ==========================================
  // HANDLE STATUS FILTER
  // ==========================================

  const handleStatusChange = (value) => {
    setStatus(value);

    fetchVisitors(
      search,
      value,
      gateStatus
    );
  };

  // ==========================================
  // HANDLE GATE STATUS FILTER
  // ==========================================

  const handleGateStatusChange = (value) => {
    setGateStatus(value);

    fetchVisitors(
      search,
      status,
      value
    );
  };

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const handleReset = () => {
    setSearch("");
    setStatus("All");
    setGateStatus("All");

    fetchVisitors("", "All", "All");
  };

  return (
    <DashboardLayout role="guard">

      <div className="mx-auto w-full max-w-[1250px]">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

          <div>

            <Link
              to="/guard"
              className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8b778e] transition hover:text-[#9b7740]"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>

            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Security Portal
            </p>

            <h1 className="text-[22px] font-extrabold tracking-tight text-[#32143b]">
              All Visitors
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Search and monitor all resident visitor requests and gate activity.
            </p>

          </div>

          <button
            type="button"
            onClick={() => fetchVisitors()}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#e2d9df] bg-white px-4 text-[10.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740] disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* ========================================== */}
        {/* STATS */}
        {/* ========================================== */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <StatCard
            title="Total Visitors"
            value={visitors.length}
            icon={Users}
            tone="emerald"
          />

          <StatCard
            title="Pending"
            value={
              visitors.filter(
                (item) => item.status === "Pending"
              ).length
            }
            icon={Clock3}
            tone="amber"
          />

          <StatCard
            title="Currently Inside"
            value={
              visitors.filter(
                (item) => item.gateStatus === "Inside"
              ).length
            }
            icon={LogIn}
            tone="sky"
          />

          <StatCard
            title="Completed"
            value={
              visitors.filter(
                (item) =>
                  item.status === "Completed" ||
                  item.gateStatus === "Exited"
              ).length
            }
            icon={CheckCircle2}
            tone="slate"
          />

        </div>

        {/* ========================================== */}
        {/* SEARCH & FILTERS */}
        {/* ========================================== */}

        <section className="mb-6 rounded-[18px] border border-[#e2d9df] bg-white p-5">

          <form
            onSubmit={handleSearch}
            className="grid gap-3 lg:grid-cols-[1fr_170px_170px_auto_auto]"
          >

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b778e]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search visitor, phone or flat number..."
                className="h-11 w-full rounded-xl border border-[#e2d9df] bg-[#f7f3ed] pl-10 pr-4 text-[11px] font-medium text-[#49394d] outline-none transition placeholder:text-[#8b778e] focus:border-[#bca16a] focus:bg-white focus:ring-4 focus:ring-[#f7f3ed]"
              />

            </div>

            {/* PASS STATUS */}

            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value)
              }
              className="h-11 rounded-xl border border-[#e2d9df] bg-white px-3 text-[10.5px] font-semibold text-[#756b78] outline-none focus:border-[#bca16a]"
            >
              <option value="All">
                All Pass Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

            {/* GATE STATUS */}

            <select
              value={gateStatus}
              onChange={(e) =>
                handleGateStatusChange(e.target.value)
              }
              className="h-11 rounded-xl border border-[#e2d9df] bg-white px-3 text-[10.5px] font-semibold text-[#756b78] outline-none focus:border-[#bca16a]"
            >
              <option value="All">
                All Gate Status
              </option>

              <option value="Not Entered">
                Not Entered
              </option>

              <option value="Inside">
                Inside
              </option>

              <option value="Exited">
                Exited
              </option>

            </select>

            <button
              type="submit"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#9b7740] px-5 text-[10.5px] font-bold text-white transition hover:bg-[#9b7740]"
            >
              <Search size={15} />
              Search
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="h-11 rounded-xl border border-[#e2d9df] px-4 text-[10.5px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed]"
            >
              Reset
            </button>

          </form>

        </section>

        {/* ========================================== */}
        {/* VISITORS TABLE */}
        {/* ========================================== */}

        <section className="overflow-hidden rounded-[18px] border border-[#e2d9df] bg-white">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2d9df] px-5 py-4">

            <div>

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                <Users
                  size={16}
                  className="text-[#9b7740]"
                />
                Visitor Records
              </h2>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                {visitors.length} visitor
                {visitors.length !== 1 ? "s" : ""} found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="flex min-h-[350px] items-center justify-center">

              <div className="flex items-center gap-2 text-[11px] font-medium text-[#8b778e]">
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Loading visitor records...
              </div>

            </div>

          ) : visitors.length === 0 ? (

            <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f3ed] text-[#8b778e]">
                <Users size={24} />
              </div>

              <h3 className="mt-4 text-[12px] font-bold text-[#49394d]">
                No Visitors Found
              </h3>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                No visitor records match your current search or filters.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead>

                  <tr className="bg-[#f7f3ed]">

                    <TableHead>Visitor</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Pass Status</TableHead>
                    <TableHead>Gate Status</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead>Action</TableHead>

                  </tr>

                </thead>

                <tbody>

                  {visitors.map((visitor) => (

                    <tr
                      key={visitor._id}
                      className="border-t border-[#eee8ed] transition hover:bg-[#f7f3ed]"
                    >

                      {/* VISITOR */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#9b7740]">
                            <User size={16} />
                          </div>

                          <div>

                            <p className="text-[11px] font-bold text-[#49394d]">
                              {visitor.visitorName || "-"}
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium text-[#8b778e]">
                              ID #{visitor._id?.slice(-6)}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="px-5 py-4 text-[10px] font-medium text-[#756b78]">
                        {visitor.phone || "-"}
                      </td>

                      {/* FLAT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#756b78]">

                          <Home
                            size={13}
                            className="text-[#8b778e]"
                          />

                          {visitor.flatNo ||
                            visitor.resident?.flatNo ||
                            "-"}

                        </div>

                      </td>

                      {/* VISIT DATE */}

                      <td className="px-5 py-4 text-[10px] font-medium text-[#756b78]">
                        {formatDate(visitor.visitDate)}
                      </td>

                      {/* PASS STATUS */}

                      <td className="px-5 py-4">
                        <PassStatus status={visitor.status} />
                      </td>

                      {/* GATE STATUS */}

                      <td className="px-5 py-4">
                        <GateStatus status={visitor.gateStatus} />
                      </td>

                      {/* ENTRY */}

                      <td className="px-5 py-4 text-[10px] font-medium text-[#756b78]">
                        {formatDateTime(visitor.entryTime)}
                      </td>

                      {/* EXIT */}

                      <td className="px-5 py-4 text-[10px] font-medium text-[#756b78]">
                        {formatDateTime(visitor.exitTime)}
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() => setSelectedVisitor(visitor)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2d9df] px-3 py-2 text-[9.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740]"
                        >
                          <Eye size={13} />
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

        {/* ========================================== */}
        {/* VISITOR DETAILS MODAL */}
        {/* ========================================== */}

        {selectedVisitor && (

          <VisitorModal
            visitor={selectedVisitor}
            onClose={() => setSelectedVisitor(null)}
          />

        )}

      </div>

    </DashboardLayout>
  );
}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
  icon: Icon,
  tone,
}) {
  const styles = {
    emerald: "bg-[#f7f3ed] text-[#9b7740]",
    amber: "bg-[#f7f3ed] text-[#9b7740]",
    sky: "bg-[#f7f3ed] text-[#9b7740]",
    slate: "bg-[#eee8ed] text-[#756b78]",
  };

  return (
    <div className="rounded-[16px] border border-[#e2d9df] bg-white p-5">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[tone]}`}
      >
        <Icon size={18} />
      </div>

      <p className="mt-4 text-[25px] font-extrabold leading-none tracking-tight text-[#32143b]">
        {value}
      </p>

      <p className="mt-2 text-[10.5px] font-semibold text-[#756b78]">
        {title}
      </p>

    </div>
  );
}


// ==========================================
// TABLE HEAD
// ==========================================

function TableHead({ children }) {
  return (
    <th className="px-5 py-3.5 text-left text-[9px] font-bold uppercase tracking-[0.08em] text-[#8b778e]">
      {children}
    </th>
  );
}


// ==========================================
// PASS STATUS
// ==========================================

function PassStatus({ status }) {
  const styles = {
    Pending:
      "bg-[#f7f3ed] text-[#9b7740]",
    Approved:
      "bg-[#f7f3ed] text-[#9b7740]",
    Completed:
      "bg-[#eee8ed] text-[#756b78]",
    Rejected:
      "bg-red-50 text-red-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] ||
        "bg-[#eee8ed] text-[#756b78]"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}


// ==========================================
// GATE STATUS
// ==========================================

function GateStatus({ status }) {
  const styles = {
    "Not Entered":
      "bg-[#eee8ed] text-[#756b78]",
    Inside:
      "bg-[#f7f3ed] text-[#9b7740]",
    Exited:
      "bg-[#f7f3ed] text-[#9b7740]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] ||
        "bg-[#eee8ed] text-[#756b78]"
      }`}
    >
      {status || "Not Entered"}
    </span>
  );
}


// ==========================================
// VISITOR DETAILS MODAL
// ==========================================

function VisitorModal({
  visitor,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#32143b]/40 p-4">

      <div className="w-full max-w-[650px] overflow-hidden rounded-[20px] bg-white shadow-xl">

        <div className="flex items-start justify-between border-b border-[#e2d9df] px-5 py-4">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9b7740]">
              Visitor Details
            </p>

            <h2 className="mt-1 text-[17px] font-bold text-[#32143b]">
              {visitor.visitorName}
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b778e] transition hover:bg-[#eee8ed]"
          >
            ×
          </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">

          <DetailItem
            label="Visitor Name"
            value={visitor.visitorName}
          />

          <DetailItem
            label="Phone Number"
            value={visitor.phone}
          />

          <DetailItem
            label="Resident"
            value={visitor.resident?.name}
          />

          <DetailItem
            label="Flat Number"
            value={
              visitor.flatNo ||
              visitor.resident?.flatNo
            }
          />

          <DetailItem
            label="Purpose"
            value={visitor.purpose}
          />

          <DetailItem
            label="Visit Date"
            value={formatDate(visitor.visitDate)}
          />

          <DetailItem
            label="Pass Status"
            value={visitor.status}
          />

          <DetailItem
            label="Gate Status"
            value={visitor.gateStatus}
          />

          <DetailItem
            label="Entry Time"
            value={formatDateTime(visitor.entryTime)}
          />

          <DetailItem
            label="Exit Time"
            value={formatDateTime(visitor.exitTime)}
          />

          <DetailItem
            label="Entry Guard"
            value={visitor.entryGuard?.name}
          />

          <DetailItem
            label="Exit Guard"
            value={visitor.exitGuard?.name}
          />

        </div>

        <div className="flex justify-end border-t border-[#e2d9df] px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl bg-[#32143b] px-5 text-[10.5px] font-bold text-white transition hover:bg-[#49394d]"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}


// ==========================================
// DETAIL ITEM
// ==========================================

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="border-b border-r border-[#eee8ed] px-5 py-4">

      <p className="text-[9px] font-medium uppercase tracking-wide text-[#8b778e]">
        {label}
      </p>

      <p className="mt-1.5 text-[11px] font-bold text-[#49394d]">
        {value || "-"}
      </p>

    </div>
  );
}


// ==========================================
// DATE HELPERS
// ==========================================

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString(
    "en-PK",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

export default AllVisitors;