import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  AlertTriangle,
  Package,
  Search,
  RefreshCw,
  LogOut,
  Loader2,
  Clock3,
  User,
  Home,
  Phone,
  ShieldAlert,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

function OverstayAlerts() {
  const [overstayVisitors, setOverstayVisitors] = useState([]);
  const [deliveryVisitors, setDeliveryVisitors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exitingId, setExitingId] = useState("");

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overstay");

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================================================
  // FETCH ALERTS
  // =========================================================

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const overstayResponse = await axios.get(
        "https://smart-society-backend-delta.vercel.app/guard/overstay-alerts",
        config
      );

      const overstayData =
        overstayResponse.data?.data || [];

      setOverstayVisitors(overstayData);

      /*
       * Delivery alerts
       *
       * We use the visitors returned by the overstay endpoint
       * and identify delivery visitors from visitorType.
       *
       * This means a delivery visitor who is currently inside
       * and has overstayed will appear here.
       */

      const deliveries = overstayData.filter(
        (visitor) =>
          visitor.visitorType === "Delivery"
      );

      setDeliveryVisitors(deliveries);
    } catch (error) {
      console.error(
        "Load Guard Alerts Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load security alerts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Refresh alerts automatically every 60 seconds
    const interval = setInterval(() => {
      fetchAlerts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // MARK EXIT
  // =========================================================

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

      // Remove from both alert lists
      setOverstayVisitors((prev) =>
        prev.filter(
          (item) => item._id !== visitor._id
        )
      );

      setDeliveryVisitors((prev) =>
        prev.filter(
          (item) => item._id !== visitor._id
        )
      );
    } catch (error) {
      console.error(
        "Mark Visitor Exit Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to record visitor exit"
      );
    } finally {
      setExitingId("");
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filterVisitors = (visitors) => {
    const value = search.toLowerCase().trim();

    if (!value) return visitors;

    return visitors.filter((visitor) => {
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
  };

  const filteredOverstayVisitors = useMemo(
    () => filterVisitors(overstayVisitors),
    [overstayVisitors, search]
  );

  const filteredDeliveryVisitors = useMemo(
    () => filterVisitors(deliveryVisitors),
    [deliveryVisitors, search]
  );

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString(
      "en-PK",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // =========================================================
  // TIME INSIDE
  // =========================================================

  const getTimeInside = (entryTime) => {
    if (!entryTime) return "—";

    const difference =
      Date.now() -
      new Date(entryTime).getTime();

    const minutes = Math.max(
      0,
      Math.floor(
        difference / (1000 * 60)
      )
    );

    const hours = Math.floor(
      minutes / 60
    );

    const remainingMinutes =
      minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  // =========================================================
  // CURRENT DATA
  // =========================================================

  const currentVisitors =
    activeTab === "overstay"
      ? filteredOverstayVisitors
      : filteredDeliveryVisitors;

  const currentCount =
    activeTab === "overstay"
      ? overstayVisitors.length
      : deliveryVisitors.length;

  return (
    <DashboardLayout role="guard">
      <div className="w-full min-w-0">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

          <div>

            <div className="mb-1 flex items-center gap-2">

              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-rose-500">
                Security Portal
              </p>

              {(overstayVisitors.length > 0 ||
                deliveryVisitors.length > 0) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[8px] font-bold text-rose-500">

                  <AlertTriangle size={10} />

                  Alert

                </span>
              )}

            </div>

            <h1 className="text-[20px] font-extrabold tracking-tight text-[#32143b] md:text-[22px]">
              Security Alerts
            </h1>

            <p className="mt-1 text-[11.5px] font-medium text-[#8b778e]">
              Monitor overstaying visitors and delivery alerts inside the society.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchAlerts}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#e2d9df] bg-white px-3 text-[10.5px] font-bold text-[#756b78] transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-60"
          >

            <RefreshCw
              size={14}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

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

        {/* ================================================= */}
        {/* ALERT STATS */}
        {/* ================================================= */}

        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* OVERSTAY */}

          <div className="rounded-[16px] border border-rose-100 bg-rose-50 p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-wide text-rose-600">
                  Overstay Alerts
                </p>

                <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#32143b]">
                  {overstayVisitors.length}
                </h2>

                <p className="mt-1 text-[9px] font-medium text-rose-400">
                  Visitors beyond allowed time
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-500">
                <ShieldAlert size={19} />
              </div>

            </div>

          </div>

          {/* DELIVERY */}

          <div className="rounded-[16px] border border-[#e2d9df] bg-[#f7f3ed] p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-wide text-[#9b7740]">
                  Delivery Alerts
                </p>

                <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#32143b]">
                  {deliveryVisitors.length}
                </h2>

                <p className="mt-1 text-[9px] font-medium text-[#bca16a]">
                  Delivery visitors overstaying
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#9b7740]">
                <Package size={19} />
              </div>

            </div>

          </div>

          {/* TOTAL */}

          <div className="rounded-[16px] border border-[#e2d9df] bg-white p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                  Active Alerts
                </p>

                <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[#32143b]">
                  {overstayVisitors.length}
                </h2>

                <p className="mt-1 text-[9px] font-medium text-[#8b778e]">
                  Require guard attention
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#756b78]">
                <AlertTriangle size={19} />
              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* TABS + SEARCH */}
        {/* ================================================= */}

        <section className="mb-5 rounded-[16px] border border-[#e2d9df] bg-white p-4">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* TABS */}

            <div className="flex rounded-xl bg-[#f7f3ed] p-1">

              <button
                type="button"
                onClick={() =>
                  setActiveTab("overstay")
                }
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-bold transition ${
                  activeTab === "overstay"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-[#8b778e] hover:text-[#756b78]"
                }`}
              >

                <AlertTriangle size={13} />

                Overstay

                <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[8px] text-rose-500">
                  {overstayVisitors.length}
                </span>

              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("delivery")
                }
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-bold transition ${
                  activeTab === "delivery"
                    ? "bg-white text-[#9b7740] shadow-sm"
                    : "text-[#8b778e] hover:text-[#756b78]"
                }`}
              >

                <Package size={13} />

                Delivery

                <span className="rounded-full bg-[#f7f3ed] px-1.5 py-0.5 text-[8px] text-[#9b7740]">
                  {deliveryVisitors.length}
                </span>

              </button>

            </div>

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-[420px]">

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
                placeholder="Search visitor, resident, flat or phone..."
                className="h-10 w-full rounded-xl border border-[#e2d9df] bg-white pl-9 pr-4 text-[11px] font-medium text-[#49394d] outline-none transition placeholder:text-[#bca9c0] focus:border-rose-400 focus:ring-2 focus:ring-rose-50"
              />

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* ALERT TABLE */}
        {/* ================================================= */}

        <section className="overflow-hidden rounded-[16px] border border-[#e2d9df] bg-white">

          <div className="flex items-center justify-between border-b border-[#e2d9df] px-5 py-4">

            <div>

              <h2 className="flex items-center gap-2 text-[13px] font-bold text-[#32143b]">

                {activeTab === "overstay" ? (
                  <AlertTriangle
                    size={15}
                    className="text-rose-500"
                  />
                ) : (
                  <Package
                    size={15}
                    className="text-[#9b7740]"
                  />
                )}

                {activeTab === "overstay"
                  ? "Overstay Visitors"
                  : "Delivery Alerts"}

              </h2>

              <p className="mt-1 text-[10px] font-medium text-[#8b778e]">

                {currentVisitors.length} visitor
                {currentVisitors.length !== 1
                  ? "s"
                  : ""}{" "}
                require attention

              </p>

            </div>

          </div>

          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading ? (

            <div className="flex items-center justify-center py-16">

              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8b778e]">

                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Checking security alerts...

              </div>

            </div>

          ) : currentVisitors.length === 0 ? (

            /* ================================================= */
            /* EMPTY */
            /* ================================================= */

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7f3ed] text-[#9b7740]">

                <CheckCircle2 size={22} />

              </div>

              <h3 className="mt-4 text-[13px] font-bold text-[#49394d]">

                {activeTab === "overstay"
                  ? "No overstay alerts"
                  : "No delivery alerts"}

              </h3>

              <p className="mt-1 text-[10.5px] text-[#8b778e]">

                {activeTab === "overstay"
                  ? "All visitors currently inside are within their allowed visit duration."
                  : "There are no delivery visitors currently requiring attention."}

              </p>

            </div>

          ) : (

            /* ================================================= */
            /* TABLE */
            /* ================================================= */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] text-left">

                <thead className="border-b border-[#eee8ed] bg-[#f7f3ed]/70">

                  <tr>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Visitor
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Resident
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Flat
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Phone
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Entry Time
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Time Inside
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Overstay
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wide text-[#8b778e]">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {currentVisitors.map(
                    (visitor) => (

                      <tr
                        key={visitor._id}
                        className="border-b border-[#eee8ed] last:border-0 hover:bg-[#f7f3ed]/50"
                      >

                        {/* VISITOR */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                activeTab ===
                                "overstay"
                                  ? "bg-rose-50 text-rose-500"
                                  : "bg-[#f7f3ed] text-[#9b7740]"
                              }`}
                            >

                              {activeTab ===
                              "overstay" ? (
                                <User size={14} />
                              ) : (
                                <Truck size={14} />
                              )}

                            </div>

                            <div>

                              <p className="text-[11px] font-bold text-[#49394d]">
                                {visitor.visitorName}
                              </p>

                              <p className="mt-0.5 text-[9.5px] text-[#8b778e]">

                                {visitor.isWalkIn
                                  ? "Walk-in Visitor"
                                  : "Pre-approved Pass"}

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* RESIDENT */}

                        <td className="px-5 py-4">

                          <p className="text-[10.5px] font-semibold text-[#756b78]">
                            {visitor.resident?.name ||
                              "—"}
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
                              visitor.resident
                                ?.flatNo ||
                              "—"}

                          </div>

                        </td>

                        {/* PHONE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[#756b78]">

                            <Phone
                              size={13}
                              className="text-[#8b778e]"
                            />

                            {visitor.phone ||
                              "—"}

                          </div>

                        </td>

                        {/* ENTRY */}

                        <td className="px-5 py-4">

                          <p className="text-[10px] font-semibold text-[#756b78]">
                            {formatDateTime(
                              visitor.entryTime
                            )}
                          </p>

                        </td>

                        {/* TIME INSIDE */}

                        <td className="px-5 py-4">

                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#f7f3ed] px-2.5 py-1.5 text-[9.5px] font-bold text-[#756b78]">

                            <Clock3 size={12} />

                            {getTimeInside(
                              visitor.entryTime
                            )}

                          </div>

                        </td>

                        {/* OVERSTAY */}

                        <td className="px-5 py-4">

                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[9.5px] font-bold text-rose-600">

                            <AlertTriangle
                              size={12}
                            />

                            {visitor.overstayMinutes ||
                              0}{" "}
                            min

                          </div>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              handleExit(
                                visitor
                              )
                            }
                            disabled={
                              exitingId ===
                              visitor._id
                            }
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-rose-500 px-3 text-[9.5px] font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >

                            {exitingId ===
                            visitor._id ? (
                              <>
                                <Loader2
                                  size={13}
                                  className="animate-spin"
                                />

                                Recording...
                              </>
                            ) : (
                              <>
                                <LogOut
                                  size={13}
                                />

                                Mark Exit
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

export default OverstayAlerts;