import PageLoader from "../../components/dashboard/PageLoader";

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
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9b7740]">
              Admin Portal
            </p>

            <h1 className="flex items-center gap-2 text-[22px] font-extrabold tracking-tight text-[#32143b]">
              <ShieldCheck
                size={23}
                className="text-[#9b7740]"
              />

              Audit Logs
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              View visitor entry and exit activity recorded by gate staff.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAuditLogs}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-none border border-[#e2d9df] bg-white px-4 py-2.5 text-[11px] font-bold text-[#756b78] transition hover:bg-[#f7f3ed] disabled:cursor-not-allowed disabled:opacity-60"
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
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <StatCard
            icon={<LogIn size={17} />}
            label="Entries"
            value={totalEntries}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

          <StatCard
            icon={<LogOut size={17} />}
            label="Exits"
            value={totalExits}
            iconClass="bg-[#f7f3ed] text-[#63366f]"
          />

          <StatCard
            icon={<Clock3 size={17} />}
            label="Currently Inside"
            value={currentlyInside}
            iconClass="bg-[#f7f3ed] text-[#9b7740]"
          />

        </div>

        {/* ======================================
            SEARCH + FILTER
        ====================================== */}

        <div className="mb-5 flex flex-col gap-4 rounded-none border border-[#e2d9df] bg-white p-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b778e]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search visitor, resident, flat or guard..."
              className="w-full rounded-none border border-[#e2d9df] bg-[#f7f3ed] py-2.5 pl-10 pr-4 text-[12px] font-medium text-[#49394d] outline-none transition focus:border-[#bca16a] focus:bg-white"
            />

          </div>

          <div className="flex flex-wrap items-center gap-3">

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-2.5 text-[11px] font-semibold text-[#756b78] outline-none focus:border-[#bca16a]"
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

            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#756b78]">
              <ShieldCheck
                size={16}
                className="text-[#9b7740]"
              />

              {filteredLogs.length} Logs
            </div>

          </div>

        </div>

        {/* ======================================
            TABLE
        ====================================== */}

        <section className="overflow-hidden rounded-none border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>
              <h2 className="text-[13px] font-bold text-[#32143b]">
                Gate Activity
              </h2>

              <p className="mt-0.5 text-[10.5px] font-medium text-[#8b778e]">
                Visitor entry and exit records created by gate staff.
              </p>
            </div>

          </div>

          {loading ? (
            <PageLoader message="Loading audit logs..." />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] border-collapse">

                <thead>
                  <tr className="bg-[#f7f3ed]">

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Visitor
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Resident / Flat
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Entry
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Exit
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Guards
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr
                        key={log._id}
                        className="border-t border-[#e2d9df] transition hover:bg-[#f7f3ed]"
                      >

                        {/* VISITOR */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-[#f7f3ed] text-[#9b7740]">
                              <UserRound size={16} />
                            </div>

                            <div>

                              <p className="text-[12px] font-bold text-[#49394d]">
                                {log.visitorName || "Unknown"}
                              </p>

                              <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-[#8b778e]">
                                <Phone size={10} />
                                {log.phone || "-"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* RESIDENT / FLAT */}

                        <td className="px-4 py-4">

                          <p className="text-[11px] font-semibold text-[#49394d]">
                            {log.resident?.name || "-"}
                          </p>

                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#8b778e]">
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
                              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#49394d]">
                                <LogIn
                                  size={12}
                                  className="text-[#9b7740]"
                                />

                                {formatDateTime(
                                  log.entryTime
                                )}
                              </div>

                              <p className="mt-1 text-[9.5px] text-[#8b778e]">
                                {log.entryGuard?.name ||
                                  "Unknown Guard"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#8b778e]">
                              No entry
                            </span>
                          )}

                        </td>

                        {/* EXIT */}

                        <td className="px-4 py-4">

                          {log.exitTime ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#49394d]">
                                <LogOut
                                  size={12}
                                  className="text-[#63366f]"
                                />

                                {formatDateTime(
                                  log.exitTime
                                )}
                              </div>

                              <p className="mt-1 text-[9.5px] text-[#8b778e]">
                                {log.exitGuard?.name ||
                                  "Unknown Guard"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#8b778e]">
                              Still inside
                            </span>
                          )}

                        </td>

                        {/* GUARDS */}

                        <td className="px-4 py-4">

                          <div className="space-y-1">

                            <p className="text-[9.5px] text-[#756b78]">
                              Entry:{" "}
                              <span className="font-semibold text-[#49394d]">
                                {log.entryGuard?.name ||
                                  "-"}
                              </span>
                            </p>

                            <p className="text-[9.5px] text-[#756b78]">
                              Exit:{" "}
                              <span className="font-semibold text-[#49394d]">
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
                            className="inline-flex items-center gap-1.5 rounded-none border border-[#e2d9df] bg-white px-3 py-2 text-[10px] font-bold text-[#756b78] transition hover:border-[#d9be82] hover:bg-[#f7f3ed] hover:text-[#9b7740]"
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
                          className="mx-auto mb-3 text-[#bca9c0]"
                        />

                        <p className="text-[12px] font-bold text-[#756b78]">
                          No audit logs found
                        </p>

                        <p className="mt-1 text-[10.5px] font-medium text-[#8b778e]">
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#32143b]/50 p-4">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-none bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9b7740]">
                    Audit Log
                  </p>

                  <h2 className="mt-1 text-[16px] font-extrabold text-[#32143b]">
                    {selectedLog.visitorName ||
                      "Visitor"}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedLog(null)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-none text-[#8b778e] transition hover:bg-[#eee8ed] hover:text-[#49394d]"
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

                <div className="flex items-center justify-between gap-4 rounded-none bg-[#f7f3ed] px-3 py-3">

                  <span className="text-[10px] font-semibold text-[#8b778e]">
                    Current Status
                  </span>

                  <StatusBadge
                    status={
                      selectedLog.gateStatus
                    }
                  />

                </div>

                {selectedLog.isWalkIn && (
                  <div className="rounded-none border border-[#e2d9df] bg-[#f7f3ed] px-3 py-3">

                    <p className="text-[10px] font-bold text-[#826331]">
                      Walk-in Visitor
                    </p>

                    <p className="mt-1 text-[9.5px] text-[#9b7740]">
                      This visitor was registered directly at the gate.
                    </p>

                  </div>
                )}

              </div>

              {/* FOOTER */}

              <div className="border-t border-[#e2d9df] px-5 py-4">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedLog(null)
                  }
                  className="w-full rounded-none bg-[#32143b] py-2.5 text-[11px] font-bold text-white transition hover:bg-[#49394d]"
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
    <div className="flex items-center justify-between rounded-none border border-[#e2d9df] bg-white p-4">

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8b778e]">
          {label}
        </p>

        <p className="mt-1 text-[20px] font-extrabold text-[#32143b]">
          {value}
        </p>
      </div>

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-none ${iconClass}`}
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
      <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[10px] font-bold text-[#9b7740]">
        <Clock3 size={12} />
        Inside
      </span>
    );
  }

  if (status === "Exited") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-[#f7f3ed] px-2.5 py-1 text-[10px] font-bold text-[#9b7740]">
        <CheckCircle2 size={12} />
        Exited
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-none bg-[#eee8ed] px-2.5 py-1 text-[10px] font-bold text-[#756b78]">
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
    <div className="flex items-center justify-between gap-4 rounded-none bg-[#f7f3ed] px-3 py-2.5">

      <div className="flex min-w-0 items-center gap-2 text-[#8b778e]">
        {icon}

        <span className="text-[10px] font-semibold">
          {label}
        </span>
      </div>

      <span className="break-all text-right text-[10.5px] font-bold text-[#49394d]">
        {value}
      </span>

    </div>
  );
}

export default AdminAuditLogs;

