
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Users,
  Search,
  RefreshCw,
  LogOut,
  Loader2,
  Clock3,
  User,
  Home,
  Phone,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function ActiveVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exitingId, setExitingId] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // FETCH ACTIVE VISITORS
  // ==========================================

  const fetchActiveVisitors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://smart-society-backend-delta.vercel.app/guard/active-visitors",
        config
      );

      setVisitors(response.data?.data || []);
    } catch (error) {
      console.error("Load Active Visitors Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load active visitors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveVisitors();
  }, []);
  const handleExit = async (visitor) => {
    const confirmExit = window.confirm(
      `Mark ${visitor.visitorName} as exited?`
    );

    if (!confirmExit) return;

    try {
      setExitingId(visitor._id);

      const response = await axios.put(
        `https://smart-society-backend-delta.vercel.app/guard/visitors/${visitor._id}/exit`,
        {},
        config
      );

      toast.success(
        response.data?.message ||
          "Visitor exit recorded successfully"
      );

      setVisitors((prev) =>
        prev.filter((item) => item._id !== visitor._id)
      );
    } catch (error) {
      console.error("Mark Visitor Exit Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to record visitor exit"
      );
    } finally {
      setExitingId("");
    }
  };

  // ==========================================
  // FILTER VISITORS
  // ==========================================

  const filteredVisitors = visitors.filter((visitor) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      visitor.visitorName
        ?.toLowerCase()
        .includes(value) ||
      visitor.phone
        ?.toLowerCase()
        .includes(value) ||
      visitor.flatNo
        ?.toLowerCase()
        .includes(value) ||
      visitor.resident?.name
        ?.toLowerCase()
        .includes(value)
    );
  });

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================
  // GET TIME INSIDE
  // ==========================================

  const getTimeInside = (entryTime) => {
    if (!entryTime) return "—";

    const difference =
      Date.now() - new Date(entryTime).getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
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
              Active Visitors
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Monitor visitors currently inside the society and record their exit.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchActiveVisitors}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[10.5px] font-bold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* ========================================== */}
        {/* ERROR */}
        {/* ========================================== */}

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle
              size={15}
              className="text-red-500"
            />

            <p className="text-[11px] font-semibold text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* ========================================== */}
        {/* STATS + SEARCH */}
        {/* ========================================== */}

        <div className="mb-5 grid gap-4 lg:grid-cols-[180px_1fr]">

          <div className="rounded-[16px] border border-emerald-100 bg-emerald-50 p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                  Currently Inside
                </p>

                <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-slate-900">
                  {visitors.length}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500">
                <Users size={19} />
              </div>

            </div>

          </div>

          <div className="flex items-center rounded-[16px] border border-slate-200 bg-white p-4">

            <div className="relative w-full">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by visitor, resident, flat number or phone..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[11.5px] font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
              />

            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* VISITORS TABLE */}
        {/* ========================================== */}

        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                Visitors Inside
              </h2>

              <p className="mt-1 text-[10px] font-medium text-slate-400">
                {filteredVisitors.length} visitor
                {filteredVisitors.length !== 1 ? "s" : ""} shown
              </p>
            </div>

          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">

              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Loading active visitors...
              </div>

            </div>
          ) : filteredVisitors.length === 0 ? (
            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Users size={22} />
              </div>

              <h3 className="mt-4 text-[13px] font-bold text-slate-700">
                {visitors.length === 0
                  ? "No visitors currently inside"
                  : "No matching visitors found"}
              </h3>

              <p className="mt-1 text-[10.5px] text-slate-400">
                {visitors.length === 0
                  ? "Visitors who enter the society will appear here."
                  : "Try searching with different information."}
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/70">

                  <tr>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Visitor
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Resident
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Flat
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Phone
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Entry Time
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Time Inside
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wide text-slate-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredVisitors.map((visitor) => (

                    <tr
                      key={visitor._id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                    >

                      {/* VISITOR */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                            <User size={14} />
                          </div>

                          <div>

                            <p className="text-[11px] font-bold text-slate-700">
                              {visitor.visitorName}
                            </p>

                            <p className="mt-0.5 text-[9.5px] text-slate-400">
                              {visitor.isWalkIn
                                ? "Walk-in Visitor"
                                : "Pre-approved Pass"}
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

                      {/* PHONE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">

                          <Phone
                            size={13}
                            className="text-slate-400"
                          />

                          {visitor.phone || "—"}

                        </div>

                      </td>

                      {/* ENTRY TIME */}

                      <td className="px-5 py-4">

                        <p className="text-[10px] font-semibold text-slate-600">
                          {formatDateTime(visitor.entryTime)}
                        </p>

                      </td>

                      {/* TIME INSIDE */}

                      <td className="px-5 py-4">

                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[9.5px] font-bold text-amber-600">

                          <Clock3 size={12} />

                          {getTimeInside(visitor.entryTime)}

                        </div>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() => handleExit(visitor)}
                          disabled={exitingId === visitor._id}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-rose-500 px-3 text-[9.5px] font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                          {exitingId === visitor._id ? (
                            <>
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />

                              Recording...
                            </>
                          ) : (
                            <>
                              <LogOut size={13} />

                              Mark Exit
                            </>
                          )}

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

export default ActiveVisitors;

