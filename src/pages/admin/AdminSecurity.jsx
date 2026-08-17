import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  LogIn,
  LogOut,
  AlertTriangle,
  Search,
  RefreshCw,
  Clock,
  User,
  Home,
  Loader2,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";


function AdminSecurity() {
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [entryLogs, setEntryLogs] = useState([]);
  const [exitLogs, setExitLogs] = useState([]);
  const [overstayAlerts, setOverstayAlerts] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH SECURITY DATA
  // ==========================================

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${getToken()}`,
      };

      const [
        activeResponse,
        entryResponse,
        exitResponse,
        overstayResponse,
      ] = await Promise.all([
        fetch("https://smart-society-backend-delta.vercel.app/admin/security/active", {
          headers,
        }),

        fetch("https://smart-society-backend-delta.vercel.app/admin/security/entry-logs", {
          headers,
        }),

        fetch("https://smart-society-backend-delta.vercel.app/admin/security/exit-logs", {
          headers,
        }),

        fetch("https://smart-society-backend-delta.vercel.app/admin/security/overstay", {
          headers,
        }),
      ]);

      const activeResult = await activeResponse.json();
      const entryResult = await entryResponse.json();
      const exitResult = await exitResponse.json();
      const overstayResult = await overstayResponse.json();

      if (!activeResponse.ok) {
        throw new Error(
          activeResult.message || "Failed to load active visitors"
        );
      }

      if (!entryResponse.ok) {
        throw new Error(
          entryResult.message || "Failed to load entry logs"
        );
      }

      if (!exitResponse.ok) {
        throw new Error(
          exitResult.message || "Failed to load exit logs"
        );
      }

      if (!overstayResponse.ok) {
        throw new Error(
          overstayResult.message || "Failed to load overstay alerts"
        );
      }

      setActiveVisitors(activeResult.data || []);
      setEntryLogs(entryResult.data || []);
      setExitLogs(exitResult.data || []);
      setOverstayAlerts(overstayResult.data || []);
    } catch (error) {
      console.error("Fetch Security Data Error:", error);
      setError(error.message || "Failed to load security data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  // ==========================================
  // SEARCH VISITORS
  // ==========================================

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);

      const response = await fetch(
        `https://smart-society-backend-delta.vercel.app/admin/security/search?search=${encodeURIComponent(
          value.trim()
        )}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to search visitors");
      }

      setSearchResults(result.data || []);
    } catch (error) {
      console.error("Search Visitors Error:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  // ==========================================
  // COUNTS
  // ==========================================

  const totalActive = activeVisitors.length;
  const totalEntries = entryLogs.length;
  const totalExits = exitLogs.length;
  const totalOverstays = overstayAlerts.length;

  return (
    <DashboardLayout role="admin">
      <div className="w-full">

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-slate-900">
              <ShieldCheck size={23} className="text-emerald-500" />
              Security
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-slate-400">
              Monitor visitors, entries, exits and security alerts.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSecurityData}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* ================= STATS ================= */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            icon={<Users size={17} />}
            label="Visitors Inside"
            value={totalActive}
            iconClass="bg-emerald-50 text-emerald-500"
          />

          <StatCard
            icon={<LogIn size={17} />}
            label="Entry Logs"
            value={totalEntries}
            iconClass="bg-sky-50 text-sky-500"
          />

          <StatCard
            icon={<LogOut size={17} />}
            label="Exit Logs"
            value={totalExits}
            iconClass="bg-amber-50 text-amber-500"
          />

          <StatCard
            icon={<AlertTriangle size={17} />}
            label="Overstay Alerts"
            value={totalOverstays}
            iconClass="bg-red-50 text-red-500"
          />

        </div>

        {/* ================= SEARCH ================= */}

        <div className="mb-5 rounded-[16px] border border-slate-200 bg-white p-4">

          <div className="mb-4 flex items-center gap-2">
            <Search size={17} className="text-emerald-500" />

            <div>
              <h2 className="text-[13px] font-bold text-slate-900">
                Search Visitors
              </h2>

              <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                Search by visitor name, phone or flat number.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search visitor, phone or flat..."
              className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-[12px] font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
            />

            {searching && (
              <Loader2
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-emerald-500"
              />
            )}
          </div>

          {/* SEARCH RESULTS */}

          {search.trim() && (
            <div className="mt-4 overflow-hidden rounded-[12px] border border-slate-200">

              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                  Search Results
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[700px] border-collapse">

                    <thead>
                      <tr className="bg-white">

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                          Visitor
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                          Phone
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                          Flat
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                          Status
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                          Gate
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {searchResults.map((visitor) => (
                        <tr
                          key={visitor._id}
                          className="border-t border-slate-200 transition hover:bg-slate-50"
                        >

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">

                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                                <User size={13} />
                              </div>

                              <div>
                                <p className="text-[11px] font-bold text-slate-700">
                                  {visitor.visitorName}
                                </p>

                                <p className="text-[9.5px] font-medium text-slate-400">
                                  {visitor.purpose || "-"}
                                </p>
                              </div>

                            </div>
                          </td>

                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">
                            {visitor.phone}
                          </td>

                          <td className="px-4 py-3">
                            <span className="text-[11px] font-semibold text-slate-700">
                              {visitor.flatNo}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <SecurityStatusBadge
                              status={visitor.status}
                            />
                          </td>

                          <td className="px-4 py-3">
                            <GateStatusBadge
                              status={visitor.gateStatus}
                            />
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              ) : (
                <div className="px-5 py-10 text-center">
                  <Search
                    size={28}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <p className="text-[12px] font-bold text-slate-600">
                    No visitors found
                  </p>

                  <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                    Try another visitor name, phone or flat number.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-[12px] border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-[12px] font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchSecurityData}
              className="text-[11px] font-bold text-red-600 hover:underline"
            >
              Retry
            </button>

          </div>
        )}

        {/* ================= OVERSTAY ALERTS ================= */}

        <section className="mb-5 overflow-hidden rounded-[16px] border border-red-200 bg-white">

          <div className="flex items-center justify-between border-b border-red-100 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <AlertTriangle size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-slate-900">
                  Overstay Alerts
                </h2>

                <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                  Visitors inside for more than 8 hours.
                </p>
              </div>

            </div>

            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-500">
              {overstayAlerts.length} Alerts
            </span>

          </div>

          {overstayAlerts.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] border-collapse">

                <thead>
                  <tr className="bg-slate-50">

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Visitor
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Flat
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Entry Time
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-slate-400">
                      Guard
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {overstayAlerts.map((visitor) => (
                    <tr
                      key={visitor._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <User size={14} />
                          </div>

                          <div>
                            <p className="text-[11px] font-bold text-slate-700">
                              {visitor.visitorName}
                            </p>

                            <p className="text-[9.5px] font-medium text-slate-400">
                              {visitor.phone}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                          <Home size={13} className="text-slate-400" />
                          {visitor.flatNo}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                          <Clock size={13} className="text-red-400" />
                          {formatDate(visitor.entryTime)}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-[11px] font-semibold text-slate-600">
                        {visitor.entryGuard?.name || "-"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="px-5 py-12 text-center">

              <ShieldCheck
                size={30}
                className="mx-auto mb-3 text-emerald-300"
              />

              <p className="text-[12px] font-bold text-slate-600">
                No overstay alerts
              </p>

              <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                All current visitors are within the allowed time.
              </p>

            </div>
          )}

        </section>

        {/* ================= ACTIVE VISITORS ================= */}

        <section className="mb-5 overflow-hidden rounded-[16px] border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <Users size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-slate-900">
                  Visitors Currently Inside
                </h2>

                <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
                  Live visitor presence in the society.
                </p>
              </div>

            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
              {activeVisitors.length} Inside
            </span>

          </div>

          {activeVisitors.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">

              {activeVisitors.map((visitor) => (
                <div
                  key={visitor._id}
                  className="rounded-[13px] border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <User size={15} />
                      </div>

                      <div>
                        <p className="text-[12px] font-bold text-slate-800">
                          {visitor.visitorName}
                        </p>

                        <p className="text-[9.5px] font-medium text-slate-400">
                          Flat {visitor.flatNo}
                        </p>
                      </div>

                    </div>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9.5px] font-bold text-emerald-600">
                      Inside
                    </span>

                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-200 pt-3">

                    <InfoRow
                      label="Phone"
                      value={visitor.phone}
                    />

                    <InfoRow
                      label="Entry"
                      value={formatDate(visitor.entryTime)}
                    />

                    <InfoRow
                      label="Guard"
                      value={visitor.entryGuard?.name || "-"}
                    />

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="px-5 py-12 text-center">

              <Users
                size={30}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="text-[12px] font-bold text-slate-600">
                No visitors currently inside
              </p>

              <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                There are currently no active visitors.
              </p>

            </div>
          )}

        </section>

        {/* ================= ENTRY / EXIT LOGS ================= */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* ENTRY LOGS */}

          <LogSection
            title="Recent Entry Logs"
            description="Latest visitor entries."
            icon={<LogIn size={17} />}
            iconClass="bg-emerald-50 text-emerald-500"
            logs={entryLogs}
            timeKey="entryTime"
            guardKey="entryGuard"
            emptyText="No entry logs found"
          />

          {/* EXIT LOGS */}

          <LogSection
            title="Recent Exit Logs"
            description="Latest visitor exits."
            icon={<LogOut size={17} />}
            iconClass="bg-amber-50 text-amber-500"
            logs={exitLogs}
            timeKey="exitTime"
            guardKey="exitGuard"
            emptyText="No exit logs found"
          />

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading Security...
            </p>
          </div>
        </div>
        )}

      </div>
    </DashboardLayout>
  );
}

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
// INFO ROW
// ==========================================

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">

      <span className="text-[10px] font-semibold text-slate-400">
        {label}
      </span>

      <span className="text-right text-[10.5px] font-semibold text-slate-600">
        {value || "-"}
      </span>

    </div>
  );
}

// ==========================================
// SECURITY STATUS BADGE
// ==========================================

function SecurityStatusBadge({ status }) {
  if (status === "Approved") {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
        Approved
      </span>
    );
  }

  if (status === "Completed") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
        Completed
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600">
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
      Pending
    </span>
  );
}

// ==========================================
// GATE STATUS BADGE
// ==========================================

function GateStatusBadge({ status }) {
  if (status === "Inside") {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
        Inside
      </span>
    );
  }

  if (status === "Exited") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
        Exited
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-600">
      Not Entered
    </span>
  );
}

// ==========================================
// LOG SECTION
// ==========================================

function LogSection({
  title,
  description,
  icon,
  iconClass,
  logs,
  timeKey,
  guardKey,
  emptyText,
}) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </div>

          <div>
            <h2 className="text-[13px] font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">
              {description}
            </p>
          </div>

        </div>

        <span className="text-[10px] font-bold text-slate-400">
          {logs.length} Logs
        </span>

      </div>

      {logs.length > 0 ? (
        <div className="space-y-2 p-4">

          {logs.slice(0, 8).map((visitor) => (
            <div
              key={visitor._id}
              className="flex items-center justify-between gap-3 rounded-[11px] border border-slate-200 bg-slate-50 p-3 transition hover:bg-white"
            >

              <div className="flex min-w-0 items-center gap-2">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500">
                  <User size={14} />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-[11px] font-bold text-slate-700">
                    {visitor.visitorName}
                  </p>

                  <p className="text-[9.5px] font-medium text-slate-400">
                    Flat {visitor.flatNo}
                  </p>

                </div>

              </div>

              <div className="shrink-0 text-right">

                <p className="text-[10px] font-semibold text-slate-600">
                  {formatLogDate(visitor[timeKey])}
                </p>

                <p className="mt-0.5 text-[9.5px] font-medium text-slate-400">
                  {visitor[guardKey]?.name || "-"}
                </p>

              </div>

            </div>
          ))}

        </div>
      ) : (
        <div className="px-5 py-12 text-center">

          <Clock
            size={28}
            className="mx-auto mb-3 text-slate-300"
          />

          <p className="text-[12px] font-bold text-slate-600">
            {emptyText}
          </p>

          <p className="mt-1 text-[10.5px] font-medium text-slate-400">
            No records are available yet.
          </p>

        </div>
      )}

    </section>
  );
}

// ==========================================
// FORMAT LOG DATE
// ==========================================

function formatLogDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleString();
}

export default AdminSecurity;