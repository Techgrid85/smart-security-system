
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  LogOut,
  Search,
  RefreshCw,
  Loader2,
  Users,
  User,
  Home,
  Clock3,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ExitLogs() {
  // ==========================================
  // STATE
  // ==========================================

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH EXIT LOGS
  // ==========================================

  const fetchExitLogs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/guard/exit-logs",
        config
      );

      setVisitors(response.data?.data || []);
    } catch (error) {
      console.error("Load Exit Logs Error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to load exit logs";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchExitLogs();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredVisitors = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return visitors;
    }

    return visitors.filter((visitor) => {
      const visitorName =
        visitor.visitorName?.toLowerCase() || "";

      const phone =
        visitor.phone?.toLowerCase() || "";

      const flatNo =
        visitor.flatNo?.toLowerCase() ||
        visitor.resident?.flatNo?.toLowerCase() ||
        "";

      const residentName =
        visitor.resident?.name?.toLowerCase() || "";

      return (
        visitorName.includes(searchText) ||
        phone.includes(searchText) ||
        flatNo.includes(searchText) ||
        residentName.includes(searchText)
      );
    });
  }, [visitors, search]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // CALCULATE VISIT DURATION
  // ==========================================

  const getDuration = (entryTime, exitTime) => {
    if (!entryTime || !exitTime) return "—";

    const difference =
      new Date(exitTime) - new Date(entryTime);

    if (difference < 0) return "—";

    const totalMinutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  };

  return (
    <DashboardLayout role="guard">
      <div className="w-full">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Security Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Exit Logs
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              View the complete history of visitors who have exited the society.
            </p>
          </div>

          <Link
            to="/guard"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#e2d9df] bg-white px-3 py-2 text-[10.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740]"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>

        {/* ========================================== */}
        {/* ERROR */}
        {/* ========================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-[11px] font-semibold text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* ========================================== */}
        {/* STATS */}
        {/* ========================================== */}

        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            icon={<LogOut size={18} />}
            label="Total Exits"
            value={visitors.length}
          />

          <StatCard
            icon={<CheckCircle2 size={18} />}
            label="Completed Visits"
            value={
              visitors.filter(
                (visitor) =>
                  visitor.status === "Completed"
              ).length
            }
          />

          <StatCard
            icon={<Users size={18} />}
            label="Walk-in Visitors"
            value={
              visitors.filter(
                (visitor) => visitor.isWalkIn
              ).length
            }
          />

        </div>

        {/* ========================================== */}
        {/* MAIN CARD */}
        {/* ========================================== */}

        <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          {/* HEADER */}

          <div className="flex flex-col gap-4 border-b border-[#e2d9df] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">
                <LogOut
                  size={16}
                  className="text-[#9b7740]"
                />
                Visitor Exit History
              </h2>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">
                {filteredVisitors.length} completed visit
                {filteredVisitors.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              {/* SEARCH */}

              <div className="relative min-w-0 sm:w-64">

                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search visitor, resident or flat..."
                  className="h-10 w-full rounded-xl border border-[#e2d9df] bg-white pl-10 pr-4 text-[10.5px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-[#bca16a] focus:ring-2 focus:ring-[#f7f3ed]"
                />
              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={() => fetchExitLogs(true)}
                disabled={refreshing || loading}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e2d9df] px-3 text-[10.5px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:text-[#9b7740] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* LOADING */}
          {/* ========================================== */}

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8b778e]">
                <Loader2
                  size={18}
                  className="animate-spin text-[#9b7740]"
                />
                Loading exit logs...
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* EMPTY */}
          {/* ========================================== */}

          {!loading &&
            filteredVisitors.length === 0 && (
              <div className="px-5 py-16 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#eee8ed] text-[#bca9c0]">
                  <LogOut size={22} />
                </div>

                <h3 className="mt-4 text-[13px] font-bold text-[#756b78]">
                  {search
                    ? "No matching exit logs"
                    : "No exit logs yet"}
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-[10.5px] leading-5 text-[#8b778e]">
                  {search
                    ? "Try searching with a different visitor name, resident, phone number or flat number."
                    : "Completed visitor exits will appear here."}
                </p>
              </div>
            )}

          {/* ========================================== */}
          {/* DESKTOP TABLE */}
          {/* ========================================== */}

          {!loading &&
            filteredVisitors.length > 0 && (
              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full min-w-[1100px] text-left">

                  <thead className="border-b border-[#eee8ed] bg-[#f7f3ed]">
                    <tr>
                      <TableHead>Visitor</TableHead>
                      <TableHead>Resident</TableHead>
                      <TableHead>Flat</TableHead>
                      <TableHead>Entry Time</TableHead>
                      <TableHead>Exit Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Exit Guard</TableHead>
                      <TableHead>Status</TableHead>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredVisitors.map((visitor) => (
                      <tr
                        key={visitor._id}
                        className="border-b border-[#eee8ed] last:border-0 transition hover:bg-[#f7f3ed]/70"
                      >

                        {/* VISITOR */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
                              <User size={15} />
                            </div>

                            <div>
                              <p className="text-[11px] font-bold text-[#49394d]">
                                {visitor.visitorName}
                              </p>

                              <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                                {visitor.phone || "No phone"}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* RESIDENT */}

                        <td className="px-5 py-4">
                          <p className="text-[10.5px] font-semibold text-[#756b78]">
                            {visitor.resident?.name || "—"}
                          </p>
                        </td>

                        {/* FLAT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#756b78]">
                            <Home
                              size={13}
                              className="text-[#8b778e]"
                            />

                            {visitor.flatNo ||
                              visitor.resident?.flatNo ||
                              "—"}
                          </div>

                        </td>

                        {/* ENTRY TIME */}

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-[10.5px] font-semibold text-[#756b78]">
                              {formatDate(visitor.entryTime)}
                            </p>

                            <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                              {formatTime(visitor.entryTime)}
                            </p>
                          </div>
                        </td>

                        {/* EXIT TIME */}

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-[10.5px] font-semibold text-[#756b78]">
                              {formatDate(visitor.exitTime)}
                            </p>

                            <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                              {formatTime(visitor.exitTime)}
                            </p>
                          </div>
                        </td>

                        {/* DURATION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#756b78]">
                            <Clock3
                              size={13}
                              className="text-[#9b7740]"
                            />

                            {getDuration(
                              visitor.entryTime,
                              visitor.exitTime
                            )}
                          </div>

                        </td>

                        {/* EXIT GUARD */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#756b78]">
                            <ShieldCheck
                              size={13}
                              className="text-[#9b7740]"
                            />

                            {visitor.exitGuard?.name || "—"}
                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span className="inline-flex rounded-full bg-[#eee8ed] px-2.5 py-1 text-[9px] font-bold text-[#756b78]">
                            {visitor.status}
                          </span>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          {/* ========================================== */}
          {/* MOBILE CARDS */}
          {/* ========================================== */}

          {!loading &&
            filteredVisitors.length > 0 && (
              <div className="space-y-3 p-4 lg:hidden">

                {filteredVisitors.map((visitor) => (
                  <div
                    key={visitor._id}
                    className="rounded-xl border border-[#e2d9df] p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f7f3ed] text-[#9b7740]">
                          <User size={16} />
                        </div>

                        <div>
                          <h3 className="text-[11.5px] font-bold text-[#49394d]">
                            {visitor.visitorName}
                          </h3>

                          <p className="mt-0.5 text-[9.5px] font-medium text-[#8b778e]">
                            {visitor.phone || "No phone"}
                          </p>
                        </div>

                      </div>

                      <span className="rounded-full bg-[#eee8ed] px-2.5 py-1 text-[9px] font-bold text-[#756b78]">
                        {visitor.status}
                      </span>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#eee8ed] pt-4">

                      <MobileDetail
                        label="Resident"
                        value={visitor.resident?.name || "—"}
                      />

                      <MobileDetail
                        label="Flat"
                        value={
                          visitor.flatNo ||
                          visitor.resident?.flatNo ||
                          "—"
                        }
                      />

                      <MobileDetail
                        label="Entry"
                        value={`${formatDate(visitor.entryTime)} • ${formatTime(visitor.entryTime)}`}
                      />

                      <MobileDetail
                        label="Exit"
                        value={`${formatDate(visitor.exitTime)} • ${formatTime(visitor.exitTime)}`}
                      />

                      <MobileDetail
                        label="Duration"
                        value={getDuration(
                          visitor.entryTime,
                          visitor.exitTime
                        )}
                      />

                      <MobileDetail
                        label="Exit Guard"
                        value={
                          visitor.exitGuard?.name || "—"
                        }
                      />

                    </div>

                  </div>
                ))}

              </div>
            )}

        </section>

      </div>
    </DashboardLayout>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-[16px] border border-[#e2d9df] bg-white p-4">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
            {label}
          </p>

          <p className="mt-2 text-[20px] font-extrabold tracking-tight text-[#49394d]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#9b7740]">
          {icon}
        </div>

      </div>

    </div>
  );
}

// ==========================================
// TABLE HEAD
// ==========================================

function TableHead({ children }) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
      {children}
    </th>
  );
}

// ==========================================
// MOBILE DETAIL
// ==========================================

function MobileDetail({ label, value }) {
  return (
    <div>
      <p className="text-[8.5px] font-bold uppercase tracking-wide text-[#8b778e]">
        {label}
      </p>

      <p className="mt-1 text-[10.5px] font-semibold text-[#756b78]">
        {value}
      </p>
    </div>
  );
}

export default ExitLogs;

