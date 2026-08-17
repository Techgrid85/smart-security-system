
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Eye,
  X,
  LogIn,
  LogOut,
  Users,
  Clock3,
  CheckCircle2,
  AlertCircle,
  UserRound,
  Home,
  Phone,
  CalendarDays,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const API_URL = "https://smart-society-backend-delta.vercel.app";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [selectedLog, setSelectedLog] = useState(null);

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH AUDIT LOGS
  // ==========================================

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${API_URL}/admin/audit-logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setLogs(response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch Audit Logs Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // FILTER LOGS
  // ==========================================

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return logs.filter((log) => {
      const matchesSearch =
        !query ||
        log.visitorName?.toLowerCase().includes(query) ||
        log.phone?.toLowerCase().includes(query) ||
        log.flatNo?.toLowerCase().includes(query) ||
        log.resident?.name?.toLowerCase().includes(query) ||
        log.entryGuard?.name?.toLowerCase().includes(query) ||
        log.exitGuard?.name?.toLowerCase().includes(query);

      let matchesType = true;

      if (typeFilter === "Entry") {
        matchesType = Boolean(log.entryTime);
      }

      if (typeFilter === "Exit") {
        matchesType = Boolean(log.exitTime);
      }

      if (typeFilter === "Inside") {
        matchesType = log.gateStatus === "Inside";
      }

      if (typeFilter === "Exited") {
        matchesType = log.gateStatus === "Exited";
      }

      return matchesSearch && matchesType;
    });
  }, [logs, search, typeFilter]);

  // ==========================================
  // STATS
  // ==========================================

  const totalLogs = logs.length;

  const totalEntries = logs.filter(
    (log) => log.entryTime
  ).length;

  const totalExits = logs.filter(
    (log) => log.exitTime
  ).length;

  const currentlyInside = logs.filter(
    (log) => log.gateStatus === "Inside"
  ).length;

  return (
    <DashboardLayout role="admin">
      <div className="w-full min-w-0 max-w-full">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-500">
              Admin Portal
            </p>

            <h1 className="flex items-center gap-2 text-[22px] font-extrabold tracking-tight text-slate-900">
              <ShieldCheck
                size={23}
                className="text-emerald-500"
              />

              Audit Logs
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              View visitor entry and exit activity recorded by gate staff.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAuditLogs}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

        </div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            icon={<Users size={17} />}
            label="Total Logs"
            value={totalLogs}
            iconClass="bg-emerald-50 text-emerald-500"
          />

          <StatCard
            icon={<LogIn size={17} />}
            label="Entries"
            value={totalEntries}
            iconClass="bg-sky-50 text-sky-500"
          />

          <StatCard
            icon={<LogOut size={17} />}
            label="Exits"
            value={totalExits}
            iconClass="bg-violet-50 text-violet-500"
          />

          <StatCard
            icon={<Clock3 size={17} />}
            label="Currently Inside"
            value={currentlyInside}
            iconClass="bg-amber-50 text-amber-500"
          />

        </div>

        {/* ======================================
            SEARCH + FILTER
        ====================================== */}

        <div className="mb-5 flex flex-col gap-4 rounded-[16px] border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search visitor, resident, flat or guard..."
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-[12px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
            />

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-semibold text-slate-600 outline-none focus:border-emerald-400"
            >
              <option value="All">
                All Activity
              </option>

              <option value="Entry">
                Entries
              </option>

              <option value="Exit">
                Exits
              </option>

              <option value="Inside">
                Currently Inside
              </option>

              <option value="Exited">
                Exited
              </option>
            </select>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <ShieldCheck
                size={16}
                className="text-emerald-500"
              />

              {filteredLogs.length} Logs
            </div>

          </div>

        </div>

        {/* ======================================
            TABLE
        ====================================== */}

        <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                Gate Activity
              </h2>

              <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                Visitor entry and exit records created by gate staff.
              </p>
            </div>

          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">

              <RefreshCw
                size={28}
                className="animate-spin text-emerald-500"
              />

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] border-collapse">

                <thead>
                  <tr className="bg-slate-50">

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Visitor
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Resident / Flat
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Entry
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Exit
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Guards
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr
                        key={log._id}
                        className="border-t border-slate-200 transition hover:bg-slate-50"
                      >

                        {/* VISITOR */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                              <UserRound size={16} />
                            </div>

                            <div>

                              <p className="text-[12px] font-bold text-slate-800">
                                {log.visitorName || "Unknown"}
                              </p>

                              <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                <Phone size={10} />
                                {log.phone || "-"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* RESIDENT / FLAT */}

                        <td className="px-4 py-4">

                          <p className="text-[11px] font-semibold text-slate-700">
                            {log.resident?.name || "-"}
                          </p>

                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                            <Home size={10} />
                            {log.flatNo ||
                              log.resident?.flatNo ||
                              "-"}
                          </p>

                        </td>

                        {/* ENTRY */}

                        <td className="px-4 py-4">

                          {log.entryTime ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-700">
                                <LogIn
                                  size={12}
                                  className="text-sky-500"
                                />

                                {formatDateTime(
                                  log.entryTime
                                )}
                              </div>

                              <p className="mt-1 text-[9.5px] text-slate-400">
                                {log.entryGuard?.name ||
                                  "Unknown Guard"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              No entry
                            </span>
                          )}

                        </td>

                        {/* EXIT */}

                        <td className="px-4 py-4">

                          {log.exitTime ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-700">
                                <LogOut
                                  size={12}
                                  className="text-violet-500"
                                />

                                {formatDateTime(
                                  log.exitTime
                                )}
                              </div>

                              <p className="mt-1 text-[9.5px] text-slate-400">
                                {log.exitGuard?.name ||
                                  "Unknown Guard"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              Still inside
                            </span>
                          )}

                        </td>

                        {/* GUARDS */}

                        <td className="px-4 py-4">

                          <div className="space-y-1">

                            <p className="text-[9.5px] text-slate-500">
                              Entry:{" "}
                              <span className="font-semibold text-slate-700">
                                {log.entryGuard?.name ||
                                  "-"}
                              </span>
                            </p>

                            <p className="text-[9.5px] text-slate-500">
                              Exit:{" "}
                              <span className="font-semibold text-slate-700">
                                {log.exitGuard?.name ||
                                  "-"}
                              </span>
                            </p>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <StatusBadge
                            status={log.gateStatus}
                          />

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedLog(log)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <Eye size={13} />
                            View
                          </button>

                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>

                      <td
                        colSpan="7"
                        className="px-5 py-14 text-center"
                      >

                        <ShieldCheck
                          size={32}
                          className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="text-[12px] font-bold text-slate-600">
                          No audit logs found
                        </p>

                        <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                          No visitor entry or exit activity matches your search.
                        </p>

                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* ======================================
            DETAILS MODAL
        ====================================== */}

        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[18px] bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-500">
                    Audit Log
                  </p>

                  <h2 className="mt-1 text-[16px] font-extrabold text-slate-900">
                    {selectedLog.visitorName ||
                      "Visitor"}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedLog(null)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={17} />
                </button>

              </div>

              {/* CONTENT */}

              <div className="space-y-3 p-5">

                <DetailRow
                  icon={<UserRound size={14} />}
                  label="Visitor"
                  value={
                    selectedLog.visitorName ||
                    "-"
                  }
                />

                <DetailRow
                  icon={<Phone size={14} />}
                  label="Phone"
                  value={
                    selectedLog.phone ||
                    "-"
                  }
                />

                <DetailRow
                  icon={<UserRound size={14} />}
                  label="Resident"
                  value={
                    selectedLog.resident?.name ||
                    "-"
                  }
                />

                <DetailRow
                  icon={<Home size={14} />}
                  label="Flat"
                  value={
                    selectedLog.flatNo ||
                    selectedLog.resident?.flatNo ||
                    "-"
                  }
                />

                <DetailRow
                  icon={<ShieldCheck size={14} />}
                  label="Purpose"
                  value={
                    selectedLog.purpose ||
                    "-"
                  }
                />

                <DetailRow
                  icon={<LogIn size={14} />}
                  label="Entry Time"
                  value={formatDateTime(
                    selectedLog.entryTime
                  )}
                />

                <DetailRow
                  icon={<UserRound size={14} />}
                  label="Entry Guard"
                  value={
                    selectedLog.entryGuard?.name ||
                    "-"
                  }
                />

                <DetailRow
                  icon={<LogOut size={14} />}
                  label="Exit Time"
                  value={formatDateTime(
                    selectedLog.exitTime
                  )}
                />

                <DetailRow
                  icon={<UserRound size={14} />}
                  label="Exit Guard"
                  value={
                    selectedLog.exitGuard?.name ||
                    "-"
                  }
                />

                <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-3">

                  <span className="text-[10px] font-semibold text-slate-400">
                    Current Status
                  </span>

                  <StatusBadge
                    status={
                      selectedLog.gateStatus
                    }
                  />

                </div>

                {selectedLog.isWalkIn && (
                  <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-3">

                    <p className="text-[10px] font-bold text-amber-700">
                      Walk-in Visitor
                    </p>

                    <p className="mt-1 text-[9.5px] text-amber-600">
                      This visitor was registered directly at the gate.
                    </p>

                  </div>
                )}

              </div>

              {/* FOOTER */}

              <div className="border-t border-slate-200 px-5 py-4">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedLog(null)
                  }
                  className="w-full rounded-lg bg-slate-900 py-2.5 text-[11px] font-bold text-white transition hover:bg-slate-800"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-white p-4">

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-[20px] font-extrabold text-slate-900">
          {value}
        </p>
      </div>

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ status }) {
  if (status === "Inside") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
        <Clock3 size={12} />
        Inside
      </span>
    );
  }

  if (status === "Exited") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
        <CheckCircle2 size={12} />
        Exited
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
      <AlertCircle size={12} />
      {status || "Unknown"}
    </span>
  );
}

// ==========================================
// DETAIL ROW
// ==========================================

function DetailRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5">

      <div className="flex min-w-0 items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[10px] font-semibold">
          {label}
        </span>
      </div>

      <span className="break-all text-right text-[10.5px] font-bold text-slate-700">
        {value}
      </span>

    </div>
  );
}

export default AdminAuditLogs;

