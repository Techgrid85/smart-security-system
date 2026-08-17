
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  LogIn,
  Search,
  RefreshCw,
  Loader2,
  Users,
  User,
  Home,
  Phone,
  Clock3,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function EntryLogs() {
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
  // FETCH ENTRY LOGS
  // ==========================================

  const fetchEntryLogs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/guard/entry-logs",
        config
      );

      const data = response.data?.data || [];

      setVisitors(data);
    } catch (error) {
      console.error("Load Entry Logs Error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to load entry logs";

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
    fetchEntryLogs();
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

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  return (
    <DashboardLayout role="guard">
      <div className="w-full">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Security Portal
            </p>

            <h1 className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[22px]">
              Entry Logs
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              View all visitors who have entered the society.
            </p>
          </div>

          <Link
            to="/guard"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10.5px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600"
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
            icon={<LogIn size={18} />}
            label="Total Entries"
            value={visitors.length}
          />

          <StatCard
            icon={<Users size={18} />}
            label="Currently Inside"
            value={
              visitors.filter(
                (visitor) =>
                  visitor.gateStatus === "Inside"
              ).length
            }
          />

          <StatCard
            icon={<CalendarDays size={18} />}
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

        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          {/* CARD HEADER */}

          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                <LogIn
                  size={16}
                  className="text-emerald-500"
                />
                Visitor Entry History
              </h2>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                {filteredVisitors.length} visitor
                {filteredVisitors.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              {/* SEARCH */}

              <div className="relative min-w-0 sm:w-64">

                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search visitor, resident or flat..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[10.5px] font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                />

              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={() => fetchEntryLogs(true)}
                disabled={refreshing || loading}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-[10.5px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
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

              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">

                <Loader2
                  size={18}
                  className="animate-spin text-emerald-500"
                />

                Loading entry logs...

              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* EMPTY */}
          {/* ========================================== */}

          {!loading &&
            filteredVisitors.length === 0 && (
              <div className="px-5 py-16 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                  <LogIn size={22} />
                </div>

                <h3 className="mt-4 text-[13px] font-bold text-slate-600">
                  {search
                    ? "No matching entry logs"
                    : "No entry logs yet"}
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-[10.5px] leading-5 text-slate-400">
                  {search
                    ? "Try searching with a different visitor name, resident, phone number or flat number."
                    : "Visitor entries will appear here when they are allowed into the society."}
                </p>

              </div>
            )}

          {/* ========================================== */}
          {/* DESKTOP TABLE */}
          {/* ========================================== */}

          {!loading &&
            filteredVisitors.length > 0 && (
              <div className="hidden overflow-x-auto lg:block">

                <table className="w-full min-w-[950px] text-left">

                  <thead className="border-b border-slate-100 bg-slate-50">

                    <tr>

                      <TableHead>
                        Visitor
                      </TableHead>

                      <TableHead>
                        Resident
                      </TableHead>

                      <TableHead>
                        Flat
                      </TableHead>

                      <TableHead>
                        Entry Date
                      </TableHead>

                      <TableHead>
                        Entry Time
                      </TableHead>

                      <TableHead>
                        Entry Guard
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredVisitors.map(
                      (visitor) => (
                        <tr
                          key={visitor._id}
                          className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70"
                        >

                          {/* VISITOR */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <User size={15} />
                              </div>

                              <div>
                                <p className="text-[11px] font-bold text-slate-700">
                                  {visitor.visitorName}
                                </p>

                                <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                                  {visitor.phone || "No phone"}
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* RESIDENT */}

                          <td className="px-5 py-4">

                            <p className="text-[10.5px] font-semibold text-slate-600">
                              {visitor.resident?.name || "—"}
                            </p>

                          </td>

                          {/* FLAT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">
                              <Home
                                size={13}
                                className="text-slate-400"
                              />

                              {visitor.flatNo ||
                                visitor.resident?.flatNo ||
                                "—"}
                            </div>

                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4">

                            <p className="text-[10.5px] font-semibold text-slate-600">
                              {formatDate(
                                visitor.entryTime
                              )}
                            </p>

                          </td>

                          {/* TIME */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">
                              <Clock3
                                size={13}
                                className="text-slate-400"
                              />

                              {formatTime(
                                visitor.entryTime
                              )}
                            </div>

                          </td>

                          {/* GUARD */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">
                              <ShieldCheck
                                size={13}
                                className="text-emerald-500"
                              />

                              {visitor.entryGuard?.name ||
                                "—"}
                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${
                                visitor.gateStatus === "Inside"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : visitor.gateStatus === "Exited"
                                  ? "bg-slate-100 text-slate-500"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {visitor.gateStatus}
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          {/* ========================================== */}
          {/* MOBILE / TABLET CARDS */}
          {/* ========================================== */}

          {!loading &&
            filteredVisitors.length > 0 && (
              <div className="space-y-3 p-4 lg:hidden">

                {filteredVisitors.map(
                  (visitor) => (
                    <div
                      key={visitor._id}
                      className="rounded-xl border border-slate-200 p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <User size={16} />
                          </div>

                          <div>
                            <h3 className="text-[11.5px] font-bold text-slate-800">
                              {visitor.visitorName}
                            </h3>

                            <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                              {visitor.phone || "No phone"}
                            </p>
                          </div>

                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                            visitor.gateStatus === "Inside"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {visitor.gateStatus}
                        </span>

                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">

                        <MobileDetail
                          label="Resident"
                          value={
                            visitor.resident?.name || "—"
                          }
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
                          label="Entry Date"
                          value={formatDate(
                            visitor.entryTime
                          )}
                        />

                        <MobileDetail
                          label="Entry Time"
                          value={formatTime(
                            visitor.entryTime
                          )}
                        />

                        <MobileDetail
                          label="Entry Guard"
                          value={
                            visitor.entryGuard?.name ||
                            "—"
                          }
                        />

                        <MobileDetail
                          label="Type"
                          value={
                            visitor.isWalkIn
                              ? "Walk-in"
                              : "Pre-approved"
                          }
                        />

                      </div>

                    </div>
                  )
                )}

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
    <div className="rounded-[16px] border border-slate-200 bg-white p-4">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-[20px] font-extrabold tracking-tight text-slate-800">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
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
    <th className="whitespace-nowrap px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
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
      <p className="text-[8.5px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[10.5px] font-semibold text-slate-600">
        {value}
      </p>
    </div>
  );
}

export default EntryLogs;

